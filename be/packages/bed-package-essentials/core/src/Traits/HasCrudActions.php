<?php

namespace JamstackVietnam\Core\Traits;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use JamstackVietnam\QueryBuilder\EloquentBuilderTrait;
use JamstackVietnam\RuleGenerator\Facades\RuleGenerator;

trait HasCrudActions
{
    use EloquentBuilderTrait;
    use HasAdvancedActions;

    public function index()
    {
        $this->checkAuthorize();

        if (request()->wantsJson()) {
            return $this->table();
        }

        return Inertia::render($this->folder() . '/Index', [
            'breadcrumbs' => [
                [
                    'url' => route($this->getResource() . '.index'),
                    'name' => 'models.table_list.' . $this->getTable(),
                ]
            ],
            'schema' => $this->getSchema()
        ]);
    }

    private function table()
    {
        $query = $this->model::query();

        // // Parse the resource options given by GET parameters
        // $resourceOptions = $this->parseResourceOptions();
        // // dd($resourceOptions);

        // // Start a new query for books using Eloquent query builder
        // // (This would normally live somewhere else, e.g. in a Repository)
        // // $query = Book::query();
        // $this->applyResourceOptions($query, $resourceOptions);
        // $items = $query->get();

        // Parse the data using Optimus\Architect
        // $parsedData = $this->parseData($books, $resourceOptions, 'books');

        // Create JSON response of parsed data
        // return response()->json($items);

        // $tableCols = RuleGenerator::getTableDefault($table);

        // $schema = $this->getSchema();
        // $schema['columns']['title'] = null;
        // $relations = $this->relationAttributes(0);
        // $model->getRelations();
        // dd($relations['with']);

        // $schema = $this->getSchema();
        // dd($schema['columns']);
        // dd($this->getSchema());
        // dd(RuleGenerator::getTableDefault($table));

        $query = $this->loadRelations($query, 3);
        $query = $this->search($query);
        $query = $this->beforeIndex($query);

        if (request()->has('paginate') && !request()->input('paginate')) {
            $items = $query->limit(request()->input('limit', 20))->get();

            if (isset($this->appends['index'])) {
                $appendAttributes = $this->appends['index'];
                $items = $items->map(function ($item) use ($appendAttributes) {
                    return $item->append($appendAttributes);
                });
            }
        } else {
            if (request()->input('fast-paginate') === 'false') {
                $items = $query->paginate(request()->input('per_page', 20));
            } else {
                $items = $query->fastPaginate(request()->input('per_page', 20));
            }

            if (isset($this->appends['index'])) {
                $appendAttributes = $this->appends['index'];
                $items = $items->through(function ($item) use ($appendAttributes) {
                    return $item->append($appendAttributes);
                });
            }

            $items = $items->through(function ($item) {
                return $this->transform($item);
            });

            $items = $items->withQueryString();
        }

        $items = $this->afterIndex($items);

        return response()->json($items);
    }

    public function form($id = null)
    {
        $this->checkAuthorize();

        $item = $this->model();

        $emptyFields = $this->getEmptyFields();

        $breadcrumbs = [[
            'url' => route($this->getResource() . '.index'),
            'name' => 'models.table_list.' . $this->getTable(),
        ]];

        if (!empty($id)) {
            $item = $this->loadRelations($item);

            if (!is_null($item->getMacro('withTrashed'))) {
                $item = $item->withTrashed();
            }

            $item = $item->findOrFail($id);
            $item = $this->setAppends($item);
            $item = $this->afterForm($item);

            if (!is_array($item)) {
                $item = $item->toArray();
            }

            $item = array_merge($emptyFields, $item);
            $breadcrumbs[] = [
                'url' => url()->current(),
                'name' => trans('models.actions.create') . ' ' . trans('models.table_list.' . $this->getTable()),
            ];
        } else {
            $item = $this->afterForm($emptyFields);
            $breadcrumbs[] = [
                'url' => url()->current(),
                'name' => trans('models.actions.create') . ' ' . trans('models.table_list.' . $this->getTable()),
            ];
        }

        if (request()->wantsJson()) {
            return response()->json($item);
        }

        return Inertia::render($this->folder() . '/Form', [
            'item' => $item,
            'breadcrumbs' => $breadcrumbs,
            'schema' => $this->getSchema(),
        ]);
    }

    public function store(Request $request, $id = null)
    {
        $request['locale'] = current_locale();
        $this->checkAuthorize();

        $rules = $this->getModelRules(__FUNCTION__, $id);

        $isValidationRequest = $request->header('X-Dry-Run') == 'true';

        if (!$isValidationRequest) {
            $appends = [];
            if ($id) {
                $appends['updated_by'] = current_admin_id();
            } else {
                $appends['created_by'] = current_admin_id();
            }

            $request->request->add([
                ...$this->getEmptyFields(),
                ...$request->all(),
                ...$appends
            ]);
        }

        $rules = $this->beforeStore($request, $rules);

        $validated = $request->validate($rules);

        if ($is_update = !empty($id)) {
            $resource = $this->updateModel($id, $request->all());
        } else {
            $data = $request->all();
            $defaultLocale = config('app.locale');
            if ($defaultLocale != current_locale() && $request->has('locale')) {
                $data['locale'] = $defaultLocale;
                $default = $this->model::create($data);

                $data['locale'] = current_locale();
                $resource = $this->updateModel($default->id, $data);
            } else {
                $resource = $this->model::create($data);
            }
        }

        $this->afterStore($request, $resource);

        if (request()->wantsJson()) {
            return response()->json($resource);
        }

        if ($is_update || (isset($this->redirectBack) && $this->redirectBack)) {
            return $this->redirectBack(__('models.has_crud_action.store', [], current_locale()));
        } else {
            return $this->redirectToForm($resource->id, __('models.has_crud_action.store', [], current_locale()));
        }
    }

    public function storeDraft(Request $request)
    {
        $id = request()->input('id') ?? null;
        $request['locale'] = current_locale();

        $this->checkAuthorize();

        $rules = $this->getModelRules(__FUNCTION__, $id);

        $rules = $this->beforeStore($request, $rules);

        foreach ($rules as $column => $rule) {
            if (str_contains($rule, 'required') && empty($request[$column])) {
                if (str_contains($rule, 'string')) {
                    $request[$column] = __('models.common.' . $column);
                } else if (str_contains($rule, 'integer')) {
                    $request[$column] = 0;
                } else if (str_contains($rule, 'array')) {
                    $request[$column] = [];
                } else {
                    $request[$column] = '';
                }
            }
        }

        if (!empty($request['status'])) {
            $request['status'] = $this->model()->statusDraft ?? null;
        }

        $isValidationRequest = $request->header('X-Dry-Run') == 'true';

        if (!$isValidationRequest) {
            $appends = [];
            if ($id) {
                $appends['updated_by'] = current_admin_id();
            } else {
                $appends['created_by'] = current_admin_id();
            }

            $request->request->add([
                ...$this->getEmptyFields(),
                ...$request->all(),
                ...$appends
            ]);
        }

        if ($is_update = !empty($id)) {
            $resource = $this->updateModel($id, $request->all());
        } else {
            $data = $request->all();
            $defaultLocale = config('app.locale');
            if ($defaultLocale != current_locale() && $request->has('locale')) {
                $data['locale'] = $defaultLocale;
                $default = $this->model::create($data);

                $data['locale'] = current_locale();
                $resource = $this->updateModel($default->id, $data);
            } else {
                $resource = $this->model::create($data);
            }
        }

        $this->afterStore($request, $resource);

        if (request()->wantsJson()) {
            return response()->json($resource);
        }

        if ($is_update || (isset($this->redirectBack) && $this->redirectBack)) {
            return $this->redirectBack(__('models.has_crud_action.store', [], current_locale()));
        } else {
            return $this->redirectToForm($resource->id, __('models.has_crud_action.store', [], current_locale()));
        }
    }

    public function destroy($id)
    {
        $this->checkAuthorize();

        try {
            DB::beginTransaction();
            $ids = explode(',', $id);
            if (count($ids) > 1) {
                $resources = $this->model::whereIn('id', $ids)->get();
                foreach ($resources as $resource) {
                    $resource->delete();
                }
            } else {
                $resource = $this->model::findOrFail($id);
                $resource->delete();
            }
            DB::commit();

            if (!is_null($this->model()->getMacro('withTrashed'))) {
                return $this->redirectBack(__('models.has_crud_action.destroy', [], current_locale()));
            } else {
                return $this->redirectToIndex();
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    public function restore($id)
    {
        $this->checkAuthorize();

        $resource = $this->model::withTrashed()->findOrFail($id);
        $resource->restore();

        return $this->redirectBack(__('models.has_crud_action.restore', [], current_locale()));
    }

    // Private

    private function model()
    {
        return new $this->model;
    }

    private function getTable($model = null)
    {
        $model = $model ?? $this->model();
        return $model->getTable();
    }

    private function getSchema($model = null)
    {
        $model = $model ?? $this->model();

        $columns = RuleGenerator::getTableSchema($model);

        if (method_exists($model, 'getTranslationModelNameDefault')) {
            $translationModel = $model->getTranslationModelNameDefault();
            $translationColumns = RuleGenerator::getTableSchema($translationModel);
            $translationColumns = collect($translationColumns)
                ->whereIn('field', $model->translatedAttributes)
                ->toArray();
            $columns = array_merge($translationColumns, $columns);
        }

        return [
            'resource' => $this->getTable(),
            'columns' => $columns
        ];
    }

    private function getRules($id = null)
    {
        return RuleGenerator::getRules($this->model(), null, null, $id);
    }

    private function folder()
    {
        return Str::studly($this->getTable());
    }

    private function search($query)
    {
        if (!method_exists($this->model, 'scopeSearchLike')) return $query;

        if ($keyword = request()->input('filters.global.value')) {
            return $query->searchLike($keyword)->distinct();
        }
        return $query;
    }

    private function getModelRules($action, $id = null)
    {
        if (method_exists($this->model, 'rules')) {
            $allRules = $this->model()->rules();
            if (isset($this->model()->rules()[$action])) {
                $rules = $allRules[$action];
            }
        }

        return $rules ?? $this->getRules($id);
    }

    private function loadRelations($query, $deepFunction = 2)
    {
        $relations = $this->relationAttributes($deepFunction);
        return $query->with($relations['with'])->without($relations['without']);
    }

    private function relationAttributes($deepFunction = 2)
    {
        $action = debug_backtrace()[$deepFunction]['function'];
        $with = request()->input('with', []);
        if (isset($this->with) && isset($this->with[$action])) {
            $with = array_merge($with, $this->with[$action]);
        }
        return [
            'with' => $with,
            'without' => isset($this->without) && isset($this->without[$action]) ? $this->without[$action] : [],
        ];
    }

    private function setAppends($item)
    {
        $attributes = $this->appendAttributes();
        return $attributes ? $item->append($attributes) : $item;
    }

    private function appendAttributes($deepFunction = 2)
    {
        $action = debug_backtrace()[$deepFunction]['function'];
        $attributes = isset($this->appends) && isset($this->appends[$action]) ? $this->appends[$action] : [];

        return array_unique($attributes);
    }

    private function redirectBack($message)
    {
        return back()->with('success', $message);
    }

    private function redirectToForm($id, $message)
    {
        $currentRoute = request()->route()->getName();
        $currentRoutePaths = explode('.', $currentRoute);
        $currentRoutePaths[count($currentRoutePaths) - 1] = 'form';
        $formRoute = implode('.', $currentRoutePaths);

        return redirect(route($formRoute, ['id' => $id]))->with('success', $message);
    }

    private function getResource()
    {
        $currentRoute = request()->route()->getName();
        $currentRoutePaths = explode('.', $currentRoute);
        array_pop($currentRoutePaths);
        return implode('.', $currentRoutePaths);
    }

    private function redirectToIndex()
    {
        $currentRoute = request()->route()->getName();
        $currentRoutePaths = explode('.', $currentRoute);
        $currentRoutePaths[count($currentRoutePaths) - 1] = 'index';
        $formRoute = implode('.', $currentRoutePaths);

        return redirect(route($formRoute));
    }

    private function getEmptyFields($model = null): array
    {
        $model = $model ?? $this->model();
        $table = $this->getTable($model);

        $tableCols = RuleGenerator::getTableDefault($table);
        $modelCols = array_values($model->getFillable());
        $modelCols = array_merge($model->translatedAttributes ?? [], $modelCols);

        $columns = array_filter($tableCols, function ($key) use ($modelCols) {
            return in_array($key, $modelCols);
        }, ARRAY_FILTER_USE_KEY);

        $columns = array_merge(
            $columns,
            $this->toSnakeCase($this->relationAttributes()['with']),
            $this->toSnakeCase($this->appendAttributes())
        );

        return $columns;
    }

    private function isPlural($word)
    {
        return Str::plural($word) === $word;
    }

    private function toSnakeCase($items)
    {
        foreach ($items as $key => $value) {
            $items[$key] = Str::snake($value);
        }
        return $items;
    }

    private function beforeStore($request, $rules)
    {
        return $rules;
    }

    private function afterStore($resource)
    {
        return $resource;
    }

    private function beforeIndex($query)
    {
        if (!request()->input('filters.global.value')) {
            return $query->orderBy('id', 'DESC');
        }
        return $query;
    }

    private function afterIndex($items)
    {
        return $items;
    }

    private function transform($item)
    {
        return $item;
    }

    private function afterForm($item)
    {
        return $item;
    }

    private function checkAuthorize()
    {
        $routeName = str_replace(current_locale() . '.', '', request()->route()->getName());

        if (!current_admin()->hasPermissionTo($routeName)) {
            return abort(403);
        }
    }

    public function updateModel($id, $data)
    {
        $resource = $this->model::query();

        if (!is_null($resource->getMacro('withTrashed'))) {
            $resource = $resource->withTrashed();
        }

        $resource = $resource->findOrFail($id);
        $resource->update($data);

        return $resource;
    }
}

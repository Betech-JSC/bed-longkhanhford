<?php

namespace JamstackVietnam\RuleGenerator\Services;

use InvalidArgumentException;
use Illuminate\Support\Str;

class Generator
{
    protected $combine;
    protected $schema;

    public function __construct($schemaManager = null)
    {
        $this->combine = new RuleCombiner;
        $this->schema = new Schema($schemaManager);
    }

    /**
     * Returns rules for the selected object
     *
     * @param  string|object $table  The table or model for which to get rules
     * @param  string $column        The column for which to get rules
     * @param  array $rules          Manual overrides for the automatically-generated rules
     * @param  integer $id           An id number to ignore for unique fields (current id)
     *
     * @return array                 Array of calculated rules for the given table/model
     */
    public function getRules($table = null, $column = null, $rules = null, $id = null)
    {
        if (is_null($table) && !is_null($column))
            throw new InvalidArgumentException;

        $uniqueRules = [];

        if (is_object($table)) {
            $uniqueRules = $this->getUniqueRules($this->getModelRules($table, $rules, $column), $id);
        } else if (is_null($table)) {
            $uniqueRules = $this->getAllTableRules();
        } else if (is_null($column)) {
            $uniqueRules = $this->getUniqueRules($this->getTableRules($table, $rules), $id);
        } else {
            $uniqueRules = $this->getUniqueRules($this->getColumnRules($table, $column, $rules), $id);
        }

        $instance = $this->getModelInstance($table);
        foreach ($instance->getCasts() as $column => $type) {
            if ($type === 'array') {
                $uniqueRules[$column] = str_replace('json', 'array', $uniqueRules[$column]);
                $uniqueRules[$column] = str_replace('text', 'array', $uniqueRules[$column]);
            }
        }
        return $uniqueRules;
    }

    public static function make()
    {
        return new static();
    }



    /**
     * Return the DB-specific rules from all tables in the database
     * (this does not contain any user-overrides)
     *
     * @return array   An associative array of columns and delimited string of rules
     */
    public function getAllTableRules()
    {
        $rules = [];

        $tables = $this->schema->tables();
        foreach ($tables as $table) {
            $rules[$table] = $this->getTableRules($table);
        }
        return $rules;
    }

    public function getModelRules($model, $column = null)
    {
        $instance = $this->getModelInstance($model);

        $table = $instance->getTable();

        if (property_exists($instance, 'rules')) {
            $instanceRules = $instance->rules;
        } elseif (method_exists($instance, 'rules')) {
            $instanceRules = $instance->rules();
        } else {
            $instanceRules = [];
        }

        $mergedRules = array_merge(
            $this->getTableRules($table),
            $instanceRules
        );

        return ($column)
            ? $this->getColumnRules($table, $column)
            : $mergedRules;
    }

    private function getModelInstance($model)
    {
        if (is_object($model)) return $model;

        $modelClass = str_replace('/', '\\', $model);

        return new $modelClass;
    }

    /**
     * Returns default values for a given table
     *
     * @param  string|object $table  The name of the table to analyze
     * @return array  An associative array of columns and delimited string of rules
     */
    public function getTableSchema($model)
    {
        $schema = [];
        $instance = $this->getModelInstance($model);

        $table = $instance->getTable();
        $columns = $this->schema->columns($table);

        foreach ($columns as $column) {
            $colName = $column->getName();

            $colNameTrans = "models.$table.$colName";
            $schema[$colName]['label'] = trans()->has($colNameTrans) ? trans($colNameTrans) : $colName;

            $schema[$colName]['rules'] = [];
            $schema[$colName]['field'] = $colName;
            $schema[$colName]['type'] = $column->getType()->getName();
            $schema[$colName]['default'] = $column->getDefault();
            if (!empty($schema[$colName]['default'])) {
                $const = get_class($instance) . '::' . strtoupper($colName) . '_LIST';
                if (defined($const)) {
                    $schema[$colName]['list'] = collect(constant($const))
                        ->map(function ($name, $value) {
                            $trans = 'common.styles.' . $value;
                            return [
                                'id' => $value,
                                'label' => $name,
                                'styles' =>  __($trans, [], current_locale()) ?? (trans()->has($trans) ? trans($trans) : false)
                            ];
                        })->values()->toArray();
                }
            }
        }

        $rules = $this->getTableRules($table);

        $schema = collect($schema)->map(function ($colValue, $colName) use ($rules) {
            return [
                ...$colValue,
                'rules' => $rules[$colName] ?? []
            ];
        })->toArray();

        return $schema;
    }

    /**
     * Returns default values for a given table
     *
     * @param  string|object $table  The name of the table to analyze
     * @return array  An associative array of columns and delimited string of rules
     */
    public function getTableDefault($table)
    {
        if (!is_string($table))
            throw new InvalidArgumentException;

        $columns = $this->schema->columns($table);
        $translationColumns = $this->schema->columns(Str::singular($table) . '_translations');

        $columns = array_merge($translationColumns, $columns);

        foreach ($columns as $key => $column) {
            $columns[$key] = $column->getDefault();
        }

        return $columns;
    }

    /**
     * Returns all rules for a given table
     *
     * @param  string|object $table  The name of the table to analyze
     * @param  array  $rules    (optional) Additional (user) rules to include
     *                          These will override the automatically generated rules
     * @return array  An associative array of columns and delimited string of rules
     */
    public function getTableRules($table, $rules = [])
    {
        $tableRules = $this->getTableRuleArray($table);

        return $this->combine->tables($rules, $tableRules);
    }

    /**
     * Returns all of the rules for a given table/column
     *
     * @param  string $table    Name of the table which contains the column
     * @param  string $column   Name of the column for which to get rules
     * @param  string|array $rules    Additional information or overrides.
     * @return string           The final calculated rules for this column
     */
    public function getColumnRules($table, $column, $rules = null)
    {
        // TODO: Work with foreign keys for exists:table,column statements

        // Get an array of rules based on column data
        $col = $this->schema->columnData($table, $column);

        $columnRuleArray = $this->getColumnRuleArray($col);
        $indexRuleArray = $this->getIndexRuleArray($table, $column);
        $merged = array_merge($columnRuleArray, $indexRuleArray);

        return $this->combine->columns($merged, $rules);
    }

    public function getUniqueRules($rules, $id, $idColumn = 'id')
    {
        if (is_null($id))  return $rules;

        if (!is_array($rules)) {
            return $this->getColumnUniqueRules($rules, $id, $idColumn);
        }

        $return = [];
        foreach ($rules as $key => $value) {
            $return[$key] = $this->getColumnUniqueRules($value, $id, $idColumn);
        }

        return $return;
    }

    /**
     * Given a set of rules, and an id for a current record,
     * returns a string with any unique rules skipping the current record.
     *
     * @param  string         $rules    A laravel rule string
     * @param  string|integer $id       The id to skip
     * @param  string         $idColumn The name of the column
     *
     * @return string The rules, including a string to skip the given id.
     */
    public function getColumnUniqueRules($rules, $id, $idColumn = 'id')
    {
        if (!is_string($rules)) return $rules;

        $upos = strpos($rules, 'unique:');

        if ($upos === False) {
            return $rules;      // no unique rules for this field; return
        }

        $pos = strpos($rules, '|', $upos);
        if ($pos === false) {       // 'unique' is the last rule; append the id
            return $rules . ',' . $id . ',' . $idColumn;
        }

        // inject the id
        return substr($rules, 0, $pos) . ',' . $id . ',' . $idColumn . substr($rules, $pos);
    }


    /**
     * Returns an array of rules for a given database table
     *
     * @param  string $table    Name of the table for which to get rules
     * @return array            rules in a nested associative array
     */
    protected function getTableRuleArray($table)
    {
        if (!is_string($table))
            throw new InvalidArgumentException;

        $rules = [];
        $columns = $this->schema->columns($table);

        foreach ($columns as $column) {
            $colName = $column->getName();

            // Add generated rules from the database for this column, if any found
            $columnRules = $this->getColumnRuleArray($column);
            if ($columnRules)
                $rules[$colName] = $columnRules;

            // Add index rules for this column, if any are found
            $indexRules = $this->getIndexRuleArray($table, $colName);

            if ($columnRules && $indexRules) {
                $rules[$colName] = array_merge($columnRules, $indexRules);
            }
        }

        return $rules;
    }

    /**
     * Returns an array of rules for a given database column, based on field information
     *
     * @param  Doctrine\DBAL\Schema\Column $col     A database column object (from Doctrine)
     * @return array                                An array of rules for this column
     */
    protected function getColumnRuleArray($col)
    {
        // dump($col);
        // dd($col->getDefault());
        $type = class_basename($col->getType());

        $className = __NAMESPACE__ . "\Types\\{$type}";

        try {
            if (class_exists($className))
                return (new $className)($col);
        } catch (Types\SkipThisColumn $e) {
            return [];
        }

        // catch (\Exception $e) {
        //     return ['Error: '.$type.' '.$e->getMessage()];
        // }
        // do not return anything for non-implemented classes
        return ['>>>' . $className];
    }

    /**
     * Determine whether a given column should include a 'unique' flag
     *
     * @param  string $table
     * @param  string $column
     * @return array
     */
    protected function getIndexRuleArray($table, $column)
    {
        // TODO: (maybe) Handle rules for indexes that span multiple columns
        $indexArray = [];
        $indexList = $this->schema->indexes($table);

        foreach ($indexList as $item) {
            $cols = $item->getColumns();
            if (in_array($column, $cols) !== false && count($cols) == 1 && $item->isUnique()) {

                $indexArray['unique'] = $table . ',' . $column;
            }
        }

        return $indexArray;
    }
}

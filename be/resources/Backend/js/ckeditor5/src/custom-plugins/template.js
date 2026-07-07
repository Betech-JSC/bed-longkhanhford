import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import View from '@ckeditor/ckeditor5-ui/src/view';

export default class Template extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        const editor = this.editor;
        const balloon = editor.plugins.get(ContextualBalloon);

        editor.ui.componentFactory.add('template', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Template',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M480-406.67 40.67-643.33 480-880l440 236.67-440 236.66Zm0 163.34L64.33-467l70-38L480-319l346.33-186 70 38L480-243.33ZM480-80 64.33-303.67l70-38 345.67 186 346.33-186 70 38L480-80Zm0-403 301-160.33-301-160.34-300.33 160.34L480-483Zm.67-160.33Z"/></svg>`,
                tooltip: true,
                isToggleable: true
            });

            view.on('execute', () => {
                if (balloon.hasView(this._balloonView)) {
                    balloon.remove(this._balloonView);
                } else {
                    this._balloonView = this._createBalloonView();
                    balloon.add({
                        view: this._balloonView,
                        position: this._getBalloonPositionData()
                    });
                }
            });

            return view;
        });
    }

    _createBalloonView() {
        const view = new View();
        const templates = [
                {
                    label: "Template 1",
                    description: "Heading with description",
                    html:
                        '<section class="bg-white dark:bg-gray-900"><div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6"><div class="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400"><h2 class="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">Powering innovation at <span class="font-extrabold">200,000+</span> companies worldwide</h2><p class="mb-4 font-light">Track work across the enterprise through an open, collaborative platform. Link issues across Jira and ingest data from other software development tools, so your IT support and operations teams have richer contextual information to rapidly respond to requests, incidents, and changes.</p><p class="mb-4 font-medium">Deliver great service experiences fast - without the complexity of traditional ITSM solutions.Accelerate critical development work, eliminate toil, and deploy changes with ease.</p><a href="#" class="inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700">Learn more<svg class="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg></a></div></div></section><p></p>',
                },
                {
                    label: "Template 2",
                    description: "Images with heading and description",
                    html:
                        '<section class="bg-white dark:bg-gray-900"><div class="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6"><div class="font-light text-gray-500 sm:text-lg dark:text-gray-400"><h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">We didn\'t reinvent the wheel</h2><p class="mb-4">We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.</p><p>We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick.</p></div><div class="grid grid-cols-2 gap-4 mt-8"><img class="w-full rounded-lg" src="https://via.placeholder.com/600x400.png" alt="office content 1"><img class="mt-4 w-full lg:mt-10 rounded-lg" src="https://via.placeholder.com/600x400.png" alt="office content 2"></div></div></section><p></p>',
                },
                {
                    label: "Template 3",
                    description: "4 photos, full screen",
                    html:
                        '<section><div class="grid grid-cols-2 gap-[16px] xl:my-[48px] md:my-[34px] my-[24px]" ><img src="https://via.placeholder.com/300x200.png" class="w-full h-auto" alt="Cover" /><img src="https://via.placeholder.com/300x200.png" class="w-full h-auto" alt="Cover" /><img src="https://via.placeholder.com/300x200.png" class="w-full h-auto" alt="Cover" /><img src="https://via.placeholder.com/300x200.png" class="w-full h-auto" alt="Cover" /></div></section><p></p>',
                },
                {
                    label: "Template 4",
                    description: "Images with description",
                    html:
                        '<section><img src="https://via.placeholder.com/1280x400.png" class="w-full h-auto xl:mb-[16px] md:mb-[12px] mb-[8px]" alt="Cover" /><h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</h4></section><p></p>',
                },
                {
                    label: "Template 5",
                    description: "3 photos with heading and description",
                    html:
                        '<section><h3>Lorem ipsum dolor sit amet</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p><div class="grid grid-cols-3 gap-x-[16px] xl:my-[48px] md:my-[34px] my-[24px]" ><img src="https://via.placeholder.com/400x400.png" class="w-full h-auto" alt="Cover" /><img src="https://via.placeholder.com/400x400.png" class="w-full h-auto" alt="Cover" /><img src="https://via.placeholder.com/400x400.png" class="w-full h-auto" alt="Cover"  /></div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p></section><p></p>',
                },
                {
                    label: "Template 6",
                    description: "2 photos with description",
                    html:
                        '<section><div class="grid grid-cols-2 gap-x-[16px] xl:my-[48px] md:my-[34px] my-[24px]" ><img src="https://via.placeholder.com/720x400.png" class="w-full h-auto" alt="Cover" /><img src="https://via.placeholder.com/720x400.png" class="w-full h-auto" alt="Cover" /></div><h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p></section><p></p>',
                },
                {
                    label: "Template 7",
                    description: "Template 2 images",
                    html: `
                            <div class="flex space-x-1 md:space-x-3 xl:space-x-6 my-[16px] md:my-[24px] xl:my-[32px]">
                                <div class="flex-1">
                                    <img src="https://via.placeholder.com/1280x400.png"
                                    class="w-full h-full object-contain my-0" />
                                </div>
                                <div class="flex-1">
                                    <img src="https://via.placeholder.com/1280x400.png" class="w-full h-full object-contain my-0" />
                                </div>
                            </div>
                            <p></p>`,
                },
                {
                    label: "Template 8",
                    description: "Template 3 images",
                    html: `
                    <div class="flex space-x-1 md:space-x-3 xl:space-x-6 my-[16px] md:my-[24px] xl:my-[32px]">
                    <div class="flex-1">
                        <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-contain my-0" />
                    </div>
                    <div class="flex-1">
                        <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-contain my-0" />
                    </div>
                    <div class="flex-1">
                        <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-contain my-0" />
                    </div>
                    </div>
                    <p></p>`,
                },
                {
                    label: "Template 9",
                    description: "Template 1 image 4 description",
                    html: `<div class="grid lg:grid-cols-2 grid-cols-1 xl:gap-8 md:gap-[22px] gap-4 items-center">
                    <div>
                        <img src="https://via.placeholder.com/720x400.png" class="w-full h-full mb-0 object-contain" />
                    </div>
                    <div class="space-y-10">
                        <div class="space-y-3">
                            <h3 class="label-1 text-gray-warm-700">Lorem ipsum</h3>
                            <p class="body-1 text-gray-warm-700">Lorem ipsum</p>
                        </div>
                        <div class="space-y-3">
                            <h3 class="label-1 text-gray-warm-700">Lorem ipsum 2</h3>
                            <p class="body-1 text-gray-warm-700">Lorem ipsum 2</p>
                        </div>
                        <div class="space-y-3">
                            <h3 class="label-1 text-gray-warm-700">Lorem ipsum</h3>
                            <p class="body-1 text-gray-warm-700">Lorem ipsum</p>
                        </div>
                        <div class="space-y-3">
                            <h3 class="label-1 text-gray-warm-700">Lorem ipsum</h3>
                            <p class="body-1 text-gray-warm-700">Lorem ipsum</p>
                        </div>
                    </div>
                </div>
                <p></p>`,
                },
                {
                    label: "Template 10",
                    description: "Template 2 images on 1 row",
                    html: `<div class="flex items-center space-x-6">
                    <div class="flex-1">
                        <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-contain my-0" />
                    </div>
                    <div class="flex-1">
                        <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-contain my-0" />
                    </div>
                    </div>
                    <p></p>`,
                },
                {
                    label: "Template 11",
                    description: "Template 2 images on 1 row with fixed ratio",
                    html: `<div class="flex space-x-6">
                    <div class="flex-1">
                        <div class="aspect-w-3 aspect-h-2">
                            <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-cover my-0" />
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="aspect-w-3 aspect-h-2">
                            <img src="https://via.placeholder.com/600x400.png" class="w-full h-full object-cover my-0" />
                        </div>
                    </div>
                    </div>
                    <p></p>`,
                },
                {
                    label: "Template 12",
                    description: "Template 1 images left 10 row text",
                    html: `
                        <div class="flex flex-col mb-6 lg:flex-row xl:mb-12 md:mb-8 lg:items-center items-start">
                            <div class="lg:max-w-[500px] flex-shrink-0 lg:mr-4 w-full h-full lg:mb-0 mb-2">
                                <img src="https://via.placeholder.com/600x400.png" class="object-contain w-full h-full my-0" />
                            </div>
                            <div class="w-full">
                                <h3>Lorem ipsum dolor sit amet</h3>
                                <p>Lorem ipsum dolor sit amet</p>
                                <ul>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                </ul>
                                <em>Lorem ipsum dolor sit amet</em>
                            </div>
                        </div>
                    <p></p>`,
                },
                {
                    label: "Template 13",
                    description: "Template 1 images right 10 row text",
                    html: `
                        <div class="flex flex-col-reverse mb-6 lg:flex-row xl:mb-12 md:mb-8 lg:items-center items-start">
                            <div class="w-full lg:mr-4">
                                <h3>Lorem ipsum dolor sit amet</h3>
                                <p>Lorem ipsum dolor sit amet</p>
                                <ul>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Lorem ipsum dolor sit amet</li>
                                </ul>
                                <em>Lorem ipsum dolor sit amet</em>
                            </div>
                            <div class="lg:max-w-[500px] flex-shrink-0 w-full h-full lg:mb-0 mb-2">
                                <img src="https://via.placeholder.com/600x400.png" class="object-contain w-full h-full my-0" />
                            </div>
                        </div>
                    <p></p>`,
                },
            ];
        const templateButtons = templates.map(template => this._createTemplateButton(template.label, template.description, template.html));

        view.setTemplate({
            tag: 'div',
            children: templateButtons,
            attributes: {
                class: [
                    'ck',
                    'ck-template-selector'
                ]
            }
        });

        return view;
    }

    _createTemplateButton(label, description, templateHtml) {
        const editor = this.editor;
        const button = new ButtonView(editor.locale);

        button.set({
            label,
            withText: true,
            tooltip: description
        });

        button.on('execute', () => {
            editor.model.change(writer => {
                // Parse the HTML string and create the corresponding CKEditor model elements
                const viewFragment = editor.data.processor.toView(templateHtml);
                const modelFragment = editor.data.toModel(viewFragment);

                // Insert the model fragment into the current selection
                editor.model.insertContent(modelFragment);

                // Close the balloon
                editor.plugins.get(ContextualBalloon).remove(this._balloonView);
            });
        });

        return button;
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const target = view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

        return { target };
    }
}

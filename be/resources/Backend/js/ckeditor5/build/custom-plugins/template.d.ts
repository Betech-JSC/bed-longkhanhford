export default class Template extends Plugin {
    static get requires(): (typeof ContextualBalloon)[];
    init(): void;
    _balloonView: View<HTMLElement> | undefined;
    _createBalloonView(): View<HTMLElement>;
    _createTemplateButton(label: any, description: any, templateHtml: any): ButtonView;
    _getBalloonPositionData(): {
        target: Range;
    };
}
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import View from '@ckeditor/ckeditor5-ui/src/view';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

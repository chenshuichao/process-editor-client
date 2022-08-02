import { Diamond, DiamondNodeView, Point, RenderingContext, SShapeElement, svg } from '@eclipse-glsp/client';
import { inject, injectable, optional } from 'inversify';
import { VNode } from 'snabbdom';
import { createExecutionBadge } from '../../execution/views';

import { CustomIconToggleActionHandler } from '../../ui-tools/tool-bar/options/action-handler';
import { getIconDecorator } from '../icon/views';
import { GatewayNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class GatewayNodeView extends DiamondNodeView {
  @inject(CustomIconToggleActionHandler) @optional() protected customIconHandler?: CustomIconToggleActionHandler;

  render(node: GatewayNode, context: RenderingContext): VNode {
    const diamond = new Diamond({ height: Math.max(node.size.height, 0), width: Math.max(node.size.width, 0), x: 0, y: 0 });
    const points = `${this.svgStr(diamond.topPoint)} ${this.svgStr(diamond.rightPoint)} ${this.svgStr(diamond.bottomPoint)} ${this.svgStr(
      diamond.leftPoint
    )}`;
    const radius = this.getRadius(node);
    return (
      <g>
        <polygon
          class-sprotty-node={true}
          class-mouseover={node.hoverFeedback}
          class-selected={node.selected}
          points={points}
          style={{ stroke: node.color }}
        />
        {getIconDecorator(this.customIconHandler?.isShowCustomIcons ? node.customIcon : node.icon, radius, node.color)}
        {context.renderChildren(node)}
        {createExecutionBadge(node, Math.max(node.size.width, 0))}
      </g>
    );
  }

  protected getRadius(node: SShapeElement): number {
    const d = Math.min(node.size.width, node.size.height);
    return d > 0 ? d / 2 : 0;
  }

  protected svgStr(point: Point): string {
    return `${point.x},${point.y}`;
  }
}

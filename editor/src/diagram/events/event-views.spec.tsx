import 'reflect-metadata';

import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { EventTypes } from '../view-types';
import setupViewTestContainer from '../views.spec';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const eventNodeSize = { width: 30, height: 30 };
  children.push({ id: 'start', type: EventTypes.START, position: { x: 100, y: 100 }, size: eventNodeSize });
  children.push({ id: 'startError', type: EventTypes.START_ERROR, position: { x: 100, y: 150 }, size: eventNodeSize });
  children.push({ id: 'startSignal', type: EventTypes.START_SIGNAL, position: { x: 100, y: 200 }, size: eventNodeSize });
  children.push({ id: 'startProgram', type: EventTypes.START_PROGRAM, position: { x: 100, y: 250 }, size: eventNodeSize });
  children.push({ id: 'end', type: EventTypes.END, position: { x: 200, y: 100 }, size: eventNodeSize });
  children.push({ id: 'endError', type: EventTypes.END_ERROR, position: { x: 200, y: 150 }, size: eventNodeSize });
  children.push({ id: 'endPage', type: EventTypes.END_PAGE, position: { x: 200, y: 200 }, size: eventNodeSize });
  children.push({ id: 'intermediate', type: EventTypes.INTERMEDIATE, position: { x: 300, y: 100 }, size: eventNodeSize });
  children.push({ id: 'intermediateTask', type: EventTypes.INTERMEDIATE_TASK, position: { x: 300, y: 150 }, size: eventNodeSize });
  children.push({ id: 'intermediateWait', type: EventTypes.INTERMEDIATE_WAIT, position: { x: 300, y: 200 }, size: eventNodeSize });
  children.push({ id: 'intermediateCallAndWait', type: EventTypes.INTERMEDIATE_CALL_AND_WAIT, position: { x: 300, y: 250 }, size: eventNodeSize });
  children.push({ id: 'boundaryError', type: EventTypes.BOUNDARY_ERROR, position: { x: 400, y: 100 }, size: eventNodeSize });
  children.push({ id: 'boundarySignal', type: EventTypes.BOUNDARY_SIGNAL, position: { x: 400, y: 150 }, size: eventNodeSize });
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
  return graph;
}

describe('EventNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let graph: SGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  it('render full graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown')
      .and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render start event node', () => {
    const view = viewRegistry.get(EventTypes.START);
    const vnode = view.render(graph.index.getById('start') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g><g></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render start error event node', () => {
    const view = viewRegistry.get(EventTypes.START_ERROR);
    const vnode = view.render(graph.index.getById('startError') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g>'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z" /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render start signal event node', () => {
    const view = viewRegistry.get(EventTypes.START_SIGNAL);
    const vnode = view.render(graph.index.getById('startSignal') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g>'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M5,0 L10,10 l-10,0 Z" /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render start program event node', () => {
    const view = viewRegistry.get(EventTypes.START_PROGRAM);
    const vnode = view.render(graph.index.getById('startProgram') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g><g></g><g>'
      + '<foreignObject class="sprotty-icon-small" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="14" width="18" x="7" y="8" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render end event node', () => {
    const view = viewRegistry.get(EventTypes.END);
    const vnode = view.render(graph.index.getById('end') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g><g></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render end error event node', () => {
    const view = viewRegistry.get(EventTypes.END_ERROR);
    const vnode = view.render(graph.index.getById('endError') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g>'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z" /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render end page event node', () => {
    const view = viewRegistry.get(EventTypes.END_PAGE);
    const vnode = view.render(graph.index.getById('endPage') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" /><g></g><g></g><g>'
      + '<foreignObject class="sprotty-icon-small" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="14" width="18" x="7" y="8" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render intermediate event node', () => {
    const view = viewRegistry.get(EventTypes.INTERMEDIATE);
    const vnode = view.render(graph.index.getById('intermediate') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" /><g></g><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render intermediate task event node', () => {
    const view = viewRegistry.get(EventTypes.INTERMEDIATE_TASK);
    const vnode = view.render(graph.index.getById('intermediateTask') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" /><g></g><g>'
      + '<foreignObject class="sprotty-icon-small" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="14" width="18" x="7" y="8" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render intermediate wait event node', () => {
    const view = viewRegistry.get(EventTypes.INTERMEDIATE_WAIT);
    const vnode = view.render(graph.index.getById('intermediateWait') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" /><g></g><g>'
      + '<foreignObject class="sprotty-icon-small" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="14" width="18" x="7" y="8" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render intermediate call and wait event node', () => {
    const view = viewRegistry.get(EventTypes.INTERMEDIATE_CALL_AND_WAIT);
    const vnode = view.render(graph.index.getById('intermediateCallAndWait') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" /><g></g><g>'
      + '<foreignObject class="sprotty-icon-small" requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="14" width="18" x="7" y="8" /></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render boundary error event node', () => {
    const view = viewRegistry.get(EventTypes.BOUNDARY_ERROR);
    const vnode = view.render(graph.index.getById('boundaryError') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" />'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z" /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render boundary signal event node', () => {
    const view = viewRegistry.get(EventTypes.BOUNDARY_SIGNAL);
    const vnode = view.render(graph.index.getById('boundarySignal') as SNode, context);
    const expectation = '<g><circle class="sprotty-node" r="15" cx="15" cy="15" />'
      + '<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" />'
      + '<svg class="sprotty-node-decorator" height="14" width="14" x="8" y="8" viewBox="0 0 10 10"><path fill="none" d="M5,0 L10,10 l-10,0 Z" /></svg><g></g></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });
});

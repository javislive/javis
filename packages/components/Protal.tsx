import React, { Component, PureComponent, createRef, RefObject } from 'react';
interface Props {
  render?: (children: any[], props: any) => any;
  [prop: string]: any;
}
interface State {
  children: Child[];
}
class Container extends Component<Props> {
  state: State = {
    children: []
  };
  insert(child: Child) {
    this.state.children.push(child);
    this.forceUpdate();
  }
  remove(child: any) {
    const children = this.state.children;
    children.every((c, index) => {
      if (child === c) {
        children.splice(index, 1);
        return false;
      }
      return true;
    });
    this.setState({ children });
    this.forceUpdate();
  }
  update() {
    this.forceUpdate();
  }
  render() {
    const render = this.props.render;
    return render ? render(this.state.children, this.props) : null;
  }
}
interface ChildProps {
  onInit: (inst: Child) => void;
  onDestory: (inst: Child) => void;
  onUpdate: (inst: Child) => void;
}
class Child extends PureComponent<ChildProps> {
  children = this.props.children;
  instProps: any = {};
  componentDidMount() {
    this.init();
  }
  update(props: any) {
    this.children = props.children;
    this.instProps = props;
    this.props.onUpdate && this.props.onUpdate(this);
  }
  init() {
    this.props.onInit && this.props.onInit(this);
  }
  destory() {
    this.props.onDestory && this.props.onDestory(this);
  }
  render() {
    return null;
  }
}

function createPortal<T>(render?: (children: any, props: any) => any) {
  let containerRef: RefObject<Container> = createRef();
  function Portal({ render: propsRender, ...props }: Props) {
    // if (container !== undefined) {
    //   throw new Error('Portal repeat');
    // }
    return (
      <Container ref={containerRef} render={propsRender || render} {...props} />
    );
  }
  class PortalComponent extends PureComponent<T> {
    child: any;
    childInst: Child | undefined;
    constructor(props: any) {
      super(props);
      let child = (
        <Child
          onInit={this.onInit}
          onUpdate={() => containerRef.current && containerRef.current.update()}
          onDestory={child =>
            containerRef.current && containerRef.current.remove(child)
          }
        />
      );
      this.child = child;
    }
    componentDidUpdate() {
      this.childInst && this.childInst.update(this.props);
    }
    componentWillUnmount() {
      this.childInst && this.childInst.destory();
    }
    render() {
      let child = this.child;
      return child;
    }
    private onInit = (child: Child) => {
      this.childInst = child;
      child.instProps = this.props;
      containerRef.current && containerRef.current.insert(child);
    };
  }
  return {
    Portal,
    Component: PortalComponent
  };
}

export { createPortal };

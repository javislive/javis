import React, {Component, PureComponent, ReactElement} from 'react';
interface Props {
  render?: (children: any[], props: any) => any;
}
interface State {
  children: Child[];
}
class Container extends Component<Props> {
  state: State = {
    children: [],
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
    this.setState({children});
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
  componentDidMount() {
    this.init();
  }
  update(props: any) {
    this.children = props.children;
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

function createPortal(render?: (children: any, props: any) => any) {
  let container: Container | null;
  function Portal({render: propsRender}: Props) {
    // if (container !== undefined) {
    //   throw new Error('Portal repeat');
    // }
    return (
      <Container ref={v => (container = v)} render={propsRender || render} />
    );
  }
  class PortalComponent extends PureComponent {
    child: any;
    childInst: Child | undefined;
    constructor(props: any) {
      super(props);
      let child = (
        <Child
          {...this.props}
          onInit={this._onInit}
          onUpdate={() => container && container.update()}
          onDestory={child => container && container.remove(child)}
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
    _onInit = (child: Child) => {
      this.childInst = child;
      container && container.insert(child);
    };
  }
  return {
    Portal,
    Component: PortalComponent,
  };
}

export {createPortal};

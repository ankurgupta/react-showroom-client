import React, { Component, PropTypes } from 'react';
import './FilterSidebarComponentItem.less';
import semver from 'semver';

export default
class FilterSidebarComponentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVersion: '',
      versions: []
    };
  }

  componentDidMount() {
    this.initComponentVersions();
  }

  initComponentVersions() {
    let { component } = this.props;
    let versions = this.getComponentVersions(component.package, component.name, this.props.componentsInfo).sort(
      (version1, version2) => semver.lt(version1, version2) ? 1 : -1
    );
    this.setState({ versions });
    this.changeCurrentVersion(versions[0]);
  }

  getComponentVersions(componentPackage, componentName, componentsInfo) {
    return componentsInfo.reduce((results, current) => {
      return (current.package === componentPackage && current.name === componentName) ?
        results.concat([current.version]) :
        results
    }, []);
  }

  changeCurrentVersion(version) {
    this.setState({ currentVersion: version });
  }

  handleVersionChange(version) {
    this.changeCurrentVersion(version);
    let componentId = this.props.componentsInfo.filter(componentInfo =>
      componentInfo.package === this.props.component.package &&
      componentInfo.name === this.props.component.name &&
      componentInfo.version === version
    )[0].id;
    this.props.onComponentChange(componentId);
  }

  render() {
    let { component, currentComponent } = this.props;
    let currentClassName = 'filter-sidebar-component-item--current';

    if (!this.props.currentComponent) {
      return null;
    }

    let isCurrent = (component.package === currentComponent.componentInfo.package) &&
      (component.name === currentComponent.componentInfo.name);
    return (
      <li
        className={
          `filter-sidebar-component-item
          ${isCurrent ? ' ' + currentClassName : ''}`
        }
        onClick={() => !isCurrent && this.handleVersionChange(this.state.currentVersion)}
      >
        <div
          className="filter-sidebar-component-item__name"
          title={component.name}
        >
          {component.name}
        </div>
        <div
          className="filter-sidebar-component-item__version"
          onClick={event => event.stopPropagation()}
        >
          <select
            className="filter-sidebar-component-item__version-select"
            onChange={event => this.handleVersionChange(event.target.value)}
          >{
            this.state.versions.map((version, index) =>
              <option key={index} value={version}>{version}</option>
            )
          }</select>
        </div>
      </li>
    )
  }
}

FilterSidebarComponentItem.propTypes = {
  currentComponent: PropTypes.object,
  component: PropTypes.object,
  componentsInfo: PropTypes.array,
  onComponentChange: PropTypes.func
};

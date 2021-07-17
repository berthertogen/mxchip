import { MDCTabBar } from '@material/tab-bar';

async function init(navigated) {

  const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
  tabBar.listen('MDCTabBar:activated',async (event) => {
    await navigated(event.detail.index)
  });
  tabBar.activateTab(0);
}

export { init };
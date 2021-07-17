import { MDCTabBar } from '@material/tab-bar';

let index = 0;

 function init() {
  const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
  tabBar.listen('MDCTabBar:activated', (event) => {
    index = event.detail.index;
    for (const element of document.getElementsByClassName(`mx-tab-content`)) {
      if (element.id === `mx-tab-content-${event.detail.index}`) {
        element.classList.remove('d-none');
        element.classList.add('d-block');
      } else {
        element.classList.add('d-none');
        element.classList.remove('d-block');
      }
    }
  });
  tabBar.activateTab(0);
}

 function nowShown() {
  return index === 0;
}

export {init, nowShown};
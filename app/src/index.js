import * as menu from './menu';
import "./styles.scss";
import * as today from "./today";
import * as now from "./now";
import * as week from "./week";


const navigated = async (index) => {
  await now.unload();
  if (index === 2) {
    await week.load();
  } else if (index === 1){
    await today.load();
  } else {
    await now.load();
  }
};

menu.init(navigated).then();
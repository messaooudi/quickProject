import angular from 'angular';

const name = 'myFilter';
// create a module
export default angular.module(name, [])
    .filter(name, () => {
        return function (items, att1, att2) {
            //do ur magic , u can add attribute 
            return items;
        };
    });
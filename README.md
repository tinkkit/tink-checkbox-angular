# Tink checkbox Angular directive

v1.0.6

## What is this repository for?

The Tink checkbox Angular directive gives you the possibility to create nested checkboxes, where the child elements will influence the state of the parent checkbox.

Tink is an in-house developed easy-to-use front-end framework for quick prototyping and simple deployment of all kinds of websites and apps, keeping a uniform and consistent look and feel.

## Setup

### Prerequisites

* nodeJS [http://nodejs.org/download/](http://nodejs.org/download/)
* bower: `npm install -g bower`

### Install

1. Go to the root of your project and type the following command in your terminal:

  `bower install tink-checkbox-angular --save`

2. Add the following files to your project:

  `<link rel="stylesheet" href="bower_components/tink-core/dist/tink.css" />` (or one of the Tink themes)

  `<script src="bower_components/tink-checkbox-angular/dist/tink-checkbox-angular.js"></script>`

3. Add `tink.checkbox` to your app module's dependency.

  `angular.module('myApp', ['tink.checkbox']);`


----------


## How to use

### tink-checkbox

### Component

###### Checkbox code: ######

```html
<div tink-checkbox-list="" data-checked="selectedIds" ng-model="data"></div>
```

###### Possible controller code: ######

```html
// Data model
$scope.data = [{
  id: 1,
  name: 'België',
  selected: false,
  childs: [{
    id: 2,
    name: 'Antwerpen',
    selected: false
  }, {
    id: 3,
    name: 'Vlaams-brabant',
    selected: true,
    childs: [{
      id: 4,
      name: 'Leuven',
      selected: true
    }]
  }]
}];
```

### Options

Attr | Type | Default | Details
--- | --- | --- | ---
data-ng-model | `[Object]` | `[]` | An array of objects wich will be viewed in the checkbox list.
data-checked | `[Object]` | `[]` |This variable holds an array of the selected checkbox id's.

## Contribution guidelines

* If you're not sure, drop us a note
* Fork this repo
* Do your thing
* Create a pull request

## Who do I talk to?

* Jasper Van Proeyen - jasper.vanproeyen@digipolis.be - Lead front-end
* Tom Wuyts - tom.wuyts@digipolis.be - Lead UX
* [The hand](https://www.youtube.com/watch?v=_O-QqC9yM28)

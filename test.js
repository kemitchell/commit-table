var commitTable = require('./')

var data = [
  {
    id: 'first',
    parents: [],
    timestamp: new Date() - 2000
  },
  {
    id: 'second',
    parents: ['first'],
    timestamp: new Date() - 1000
  },
  {
    id: 'third',
    parents: [],
    timestamp: new Date() - 500
  },
  {
    id: 'merging',
    parents: ['third', 'second'],
    timestamp: new Date()
  }
]

document.body.appendChild(commitTable({
  data,
  comparator: function (a, b) {
    return new Date(a.timestamp) - new Date(b.timestamp)
  },
  render: function (element, commit, column) {
    element.appendChild(document.createTextNode(commit.id))
    element.appendChild(document.createElement('br'))
    element.appendChild(document.createTextNode('column ' + column))
    element.appendChild(document.createElement('br'))
    element.appendChild(document.createTextNode(new Date(commit.timestamp).toISOString()))
    element.appendChild(document.createElement('br'))
    element.appendChild(document.createTextNode(commit.parents.join(',')))
  }
}))

var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'public'), {
	repo: 'https://github.com/lauterry/brocnote.git'
}, function (err) {
	if (err) {
		console.log(err);
	}
});
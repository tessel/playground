.PHONY: all

all:
	./node_modules/.bin/browserify browser/index.js > build/bundle.js
	./node_modules/.bin/jade -o build views/index.jade
	cp -rf public/* build
	git push origin `git subtree split --prefix build master`:refs/heads/gh-pages --force

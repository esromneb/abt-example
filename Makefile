.PHONY: all build watch dev start test pretest lint jestc

build:
	npm run build

dev:
	npm run dev

dev_client:
	npm run dev_client

test: jestc
	npm run test


pretest:
	npm run pretest

# jest clear cache
jestc:
	npm run jestc

# jest watch tests
jestw:
	npm run jestw

clean:
	rm -rf build
	rm -rf server_public

prod:
	npm run prod

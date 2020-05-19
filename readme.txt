NPM: name of command line "Module" that installs third-party "libraries" (code) for me

Node_modules is the folder in which NPM has installed the third-party libraries mentioned above.

package.json is a list of third-party libraries that your project depends upon.

package-lock.json is the currently installed version of everything. (package.json has "this version or above", whereas lock is the ACTUAL installed version. The idea is that if someone else has done NPM-install, you can copy exactly what they had by using lock.


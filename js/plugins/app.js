/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "3b0aa248adc8815cfd3d"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/plugins/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hot_Game_Character.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Game_Character = function hot_Game_Character() {
  Object.assign(Game_Character.prototype, {
    distanceFromCharacter: function distanceFromCharacter(character) {
      return Math.abs(this.deltaXFrom(character.x)) + Math.abs(this.deltaYFrom(character.y));
    },
    runStraight: function runStraight() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

      this.setMovementSuccess(this.canPass(this._x, this._y, this._direction));
      if (this.isMovementSucceeded()) {
        //this.setDirection(this._direction)
        this._x += $gameMap.roundXWithDirection(0, this._direction) * step;
        this._y += $gameMap.roundYWithDirection(0, this._direction) * step;
        //this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(this._direction))
        //this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(this._direction))
        this.increaseSteps();
      } else {
        //this.setDirection(this._direction)
        this.checkEventTriggerTouchFront(this._direction);
      }
    },
    canJump: function canJump() {
      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._realX;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._realY;
      var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this._direction;
      var step = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;

      //let x2 = x+ $gameMap.roundXWithDirection(0, d)*(step-1) //其中一种情况会出错
      //let y2 = y+ $gameMap.roundYWithDirection(0, d)*(step-1) //其中一种情况会出错
      var x2 = $gameMap.roundXWithDirection(x, d);
      var y2 = $gameMap.roundYWithDirection(y, d);
      /*//第一个判定决定是否能越过物体,加了判定等后，有时候会卡住不能释放
      if (!this.canPass(x,y,d)) {
        return false
      }
      */
      if (!this.canPass(x2, y2, d)) {
        return false;
      }
      return true;
    },

    /*
    canJump(x, y, d, step=2) {
      let x2 = x+ $gameMap.roundXWithDirection(0, d)*step
      let y2 = y+ $gameMap.roundYWithDirection(0, d)*step
      if (!$gameMap.isValid(x2, y2)) {
        return false
      }
      if (this.isThrough() || this.isDebugThrough()) {
        return true
      }
      if (!this.isMapPassable(x, y, d)) {
        return false
      }
      if (this.isCollidedWithCharacters(x2, y2)) {
        return false
      }
      return true;
    },
    */
    jumpStraight: function jumpStraight() {
      var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._direction;

      this.setMovementSuccess(this.canJump(this._x, this._y, d));
      if (this.isMovementSucceeded()) {
        this.setDirection(d);
        this.skillJump(d);
      } else {
        this.setDirection(d);
        this.checkEventTriggerTouchFront(d);
      }
    },
    skillJump: function skillJump() {
      var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._direction;
      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

      if (!this.isJumping()) {
        switch (d) {
          case 8:
            this.jump(0, -1 * step);
            break;
          case 2:
            this.jump(0, 1 * step);
            break;
          case 4:
            this.jump(-1 * step, 0);
            break;
          case 6:
            this.jump(1 * step, 0);
            break;
        }
      }
    },
    isSkilling: function isSkilling() {},
    skillCharacter: function skillCharacter() {
      var id = Number($dataMap.events.length);
      var x = Number($gameMap.roundXWithDirection(this._x, this._direction));
      var y = Number($gameMap.roundYWithDirection(this._y, this._direction));
      //let y=Number(this._realY+1)
      //伪造生成初始的地图上事件数据
      //然后在实际的地图中依据数据生成事件
      //用事件生成加入场景中的精灵集中的角色土块
      //push的值应该用类来生成,并且用this.x来使用
      $dataMap.events.push({
        "id": id,
        "name": "EV00" + id,
        "note": "",
        "pages": [{
          "conditions": {
            "actorId": 1,
            "actorValid": false,
            "itemId": 1,
            "itemValid": false,
            "selfSwitchCh": "A",
            "selfSwitchValid": false,
            "switch1Id": 1,
            "switch1Valid": false,
            "switch2Id": 1,
            "switch2Valid": false,
            "variableId": 1,
            "variableValid": false,
            "variableValue": 0
          },
          "directionFix": true,
          "image": {
            "tileId": 0,
            "characterName": "!Door2",
            "direction": 8,
            "pattern": 0,
            "characterIndex": 0
          },
          "list": [{
            "code": 0,
            "indent": 0,
            "parameters": []
          }],
          "moveFrequency": 10,
          "moveRoute": {
            "list": [{
              "code": 0,
              "parameters": []
            }],
            "repeat": true,
            "skippable": false,
            "wait": false
          },
          "moveSpeed": 3,
          "moveType": 2,
          "priorityType": 1,
          "stepAnime": true,
          "through": true,
          "trigger": 0,
          "walkAnime": true
        }],
        "x": x,
        "y": y
      });
      $gameMap._events.push(new Game_Event($gameMap._mapId, id));
      SceneManager._scene._spriteset._tilemap.addChild(new Sprite_Character($gameMap._events[$gameMap._events.length - 1]));
    }
  });
};
module.exports = hot_Game_Character;

/***/ }),

/***/ "./src/hot_Game_Event.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Game_Event = function hot_Game_Event() {
  Object.assign(Game_Event.prototype, {
    JumpTypeRandom: function JumpTypeRandom() {
      switch (Math.randomInt(6)) {
        case 0:case 1:
          this.JumpRandom();
          break;
        case 2:case 3:case 4:
          this.jumpStraight();
          break;
        case 5:
          this.resetStopCount();
          break;
      }
    },
    JumpRandom: function JumpRandom() {
      var d = 2 + Math.randomInt(4) * 2;
      if (this.canJump(this.x, this.y, d)) {
        this.skillJump(d);
      }
    },
    updateSelfMovement: function updateSelfMovement() {
      if (!this._locked && this.isNearTheScreen() && this.checkStop(this.stopCountThreshold())) {
        switch (this._moveType) {
          case 1:
            this.moveTypeRandom();
            break;
          case 2:
            this.moveTypeTowardPlayer();
            break;
          case 3:
            this.moveTypeCustom();
            break;
          case 4:
            this.moveAwayFromPlayer();
            break;
          case 5:
            this.JumpTypeRandom();
            break;
        }
      }
    }
  }
  /*
  update(){
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();
    this._erased = true;
    this.refresh();
  }
  */
  );
};
module.exports = hot_Game_Event;

/***/ }),

/***/ "./src/hot_Game_Interpreter.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Game_Interpreter = function hot_Game_Interpreter() {
  Object.assign(Game_Interpreter.prototype, {
    本体: function _(command) {
      switch (command) {
        case "跳":
          console.log('开始跳');
          this._self()._moveType = 5;
          break;
        case "远离":
          console.log('开始远离');
          this._self()._moveType = 4;
          break;
        case "消失":
          console.log(this._eventId);
          this._self().erase();
          //$gameMap._events.splice(this._eventId,1)
          //console.log($gameMap._events)
          break;
        case "kill":
          console.log(this._eventId);
          this._self().clearPageSettings();
          //$gameMap._events.splice(this._eventId,1)
          //console.log($gameMap._events)
          break;
        case "归位":
          this._self().locate(1, 1);
          //$gameMap._events.splice(this._eventId,1)
          //console.log($gameMap._events)
          break;
        case "标记":
          if (!$gamePlayer.isMoving()) {
            $gamePlayer.moveTowardCharacter(this._self());
          }
          break;
      }
      //console.log('真实坐标x'+$gameMap._events[this._eventId]._realX)
    },
    _self: function _self() {
      return $gameMap._events[this._eventId];
    }
  });
};
module.exports = hot_Game_Interpreter;

//在事件页面直接设定脚本 this.本体() 即可执行

/***/ }),

/***/ "./src/hot_Game_Map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Game_Map = function hot_Game_Map() {
  //let Gamp_Map_prototype_tileWidth=Game_Map.prototype.tileWidth
  //let Gamp_Map_prototype_tileHeight=Game_Map.prototype.tileHeight
  Object.assign(Game_Map.prototype, {
    tileWidth: function tileWidth() {
      return 48;
    },
    tileHeight: function tileHeight() {
      return 48;
    }
  });
};
module.exports = hot_Game_Map;

/***/ }),

/***/ "./src/hot_Game_Player.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Game_Player = function hot_Game_Player() {
  var Game_Player_prototype_update = Game_Player.prototype.update;
  /*
  Game_Player.prototype.update=function () {
      Game_Player_prototype_update.call(this)
  }
  //两种方法在hot加载的环境中都不能再正常运行，人物会卡图
  //测试发现即使不放进去也会卡图
  */
  //error createArray error
  Object.assign(Game_Player.prototype, {
    update: function update() {
      Game_Player_prototype_update.apply(this, arguments);
      /*
      if(Input.isPressed('control')){
        for(let _e of $gameMap._events){
          if(!_e){
            }else  {
            console.log('有事件')
            if(!_e._erase){
              console.log('没函数')
            }else {
              console.log(_e)
              _e._erase()//
            }
          }
        }
        //console.log($gameMap._events)
        //原来error是出在第一个是空的
      }
      //console.log(1)
      */
    }
  });
};
module.exports = hot_Game_Player;

/***/ }),

/***/ "./src/hot_Input.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Input = function hot_Input() {
  Input.keyMapper = {
    9: 'tab', // tab
    13: 'ok', // enter
    16: 'shift', // shift
    17: 'control', // control
    18: 'control', // alt
    27: 'escape', // escape
    32: 'space', // space
    33: 'pageup', // pageup
    34: 'pagedown', // pagedown
    37: 'left', // left arrow
    38: 'up', // up arrow
    39: 'right', // right arrow
    40: 'down', // down arrow
    45: 'escape', // insert
    70: 'f', // f
    72: 'h', // h
    81: 'pageup', // Q
    87: 'pagedown', // W
    88: 'escape', // X
    90: 'ok', // Z
    96: 'escape', // numpad 0
    98: 'down', // numpad 2
    100: 'left', // numpad 4
    102: 'right', // numpad 6
    104: 'up', // numpad 8
    120: 'debug' // F9
  };
};
module.exports = hot_Input;

/***/ }),

/***/ "./src/hot_Scene_Boot.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Scene_Boot = function hot_Scene_Boot() {
  console.log('一般场景只会在初始化生效');
  Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
      DataManager.setupBattleTest();
      SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
      DataManager.setupEventTest();
      SceneManager.goto(Scene_Map);
    } else {
      this.checkPlayerLocation();
      DataManager.setupNewGame();
      //SceneManager.goto(Scene_TankWarTitle)
      //SceneManager.goto(Scene_Title);
      SceneManager.goto(Scene_Map);
      Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
  };
  //强行回开头
  //热加载回去
  //SceneManager.goto(Scene_Title);
};
module.exports = hot_Scene_Boot;

/***/ }),

/***/ "./src/hot_Scene_Map.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Scene_Map = function hot_Scene_Map() {
  var Scene_Map_prototype_update = Scene_Map.prototype.update;
  var Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Object.assign(Scene_Map.prototype, {
    disFromCharacter: function disFromCharacter(character_1, character_2) {
      return Math.abs(this.deltaX(character_1._realX, character_2._realX)) + Math.abs(this.deltaY(character_1._realY, character_2._realY));
      //实际上没有this,因为Scene_Map不是$gameMap
    },
    createAllWindows: function createAllWindows() {
      Scene_Map_createAllWindows.call(this);
      console.log('加载Winbar');
      this.addWindow(new Window_Bar($gamePlayer));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $gameMap.events()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _e = _step.value;

          this.addWindow(new Window_Bar(_e));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    update: function update() {
      //Scene_Map_prototype_update.call(this)
      //响应按钮跳跃  问题是还没把视角移动，并且边界判定
      //console.log(1)
      if (Input.isPressed('space')) {
        $gamePlayer.jumpStraight();

        //响应按钮删掉所有事件
        //console.log($gameMap._events)
        /*
        for(let _e of $gameMap._events){
          if(!!_e){
            _e.erase()//是自己函数名写错了,erase没有下划线
            //_e._erased = true//有问题，根本这类的属性都没有了
            //_e.refresh()//由于事件列表的第一个是空函数，所以不行 //直接 _erase的方法不见了，只能用次一级的方法
          }
        }
        */

        //$gameMap._events[2].clearPageSettings()
        //压根不生效，可能和场景自己的update冲突或者在this的获得有问题，因为总是undefined
        //$gameMap._events.splice(2,1)
        //$gameMap._events[2].erase()
        //console.log($gameMap)
        /*
        for(let _e of $gameMap._events){
          if(typeof(_e._erase)=="undefined"){
            _e._erase()
          }
        }
        */
        /*
        for(let i=0;i<=$gameMap._events.length;i++){
          console.log(i)
          $gameMap._events[i]._erase()
        }
        */
      }
      if (Input.isPressed('shift')) {
        if (!$gamePlayer.isMoving()) {
          //$gamePlayer.moveTowardCharacter()
          $gamePlayer.setMoveSpeed(6);
          $gamePlayer.moveStraight($gamePlayer._direction);
          /*
          switch($gamePlayer._direction){
            case 8:
              $gamePlayer.jump(0,-2)
              break
            case 2:
              $gamePlayer.jump(0,2)
              break
            case 4:
              $gamePlayer.jump(-2,0)
              break
            case 6:
              $gamePlayer.jump(2,0)
              break
          }
          */
        }

        //响应按钮删掉所有事件
        //console.log($gameMap._events)
        /*
        for(let _e of $gameMap._events){
          if(!!_e){
            _e.erase()//是自己函数名写错了,erase没有下划线
            //_e._erased = true//有问题，根本这类的属性都没有了
            //_e.refresh()//由于事件列表的第一个是空函数，所以不行 //直接 _erase的方法不见了，只能用次一级的方法
          }
        }
        */

        //$gameMap._events[2].clearPageSettings()
        //压根不生效，可能和场景自己的update冲突或者在this的获得有问题，因为总是undefined
        //$gameMap._events.splice(2,1)
        //$gameMap._events[2].erase()
        //console.log($gameMap)
        /*
        for(let _e of $gameMap._events){
          if(typeof(_e._erase)=="undefined"){
            _e._erase()
          }
        }
        */
        /*
        for(let i=0;i<=$gameMap._events.length;i++){
          console.log(i)
          $gameMap._events[i]._erase()
        }
        */
      }
      if (Input.isPressed('control')) {
        SceneManager._scene._spriteset._tilemap.children.splice(8, 1);
        //console.log($gameMap.disFromCharacter($gamePlayer,$gameMap.events()[0]))
        if (!$gamePlayer.isMoving()) {
          //$gamePlayer.moveTowardCharacter()
          //$gamePlayer.turnTowardCharacter()
          //$gameMap._event[1]

        }
      }
      if (Input.isPressed('f')) {
        console.log(1);
        var animation = $dataAnimations[3];
        var name1 = animation.animation1Name;
        var name2 = animation.animation2Name;
        var hue1 = animation.animation1Hue;
        var hue2 = animation.animation2Hue;
        ImageManager.requestAnimation(name1, hue1);
        ImageManager.requestAnimation(name2, hue2);
      }
      if (Input.isPressed('h')) {

        $gamePlayer.skillCharacter();
      }
      Scene_Map_prototype_update.call(this);
    }
  });
};
module.exports = hot_Scene_Map;

/***/ }),

/***/ "./src/hot_Scene_Title_new.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hot_Scene_Title_new = function hot_Scene_Title_new() {
  var Scene_Title_new = function (_Scene_Base) {
    _inherits(Scene_Title_new, _Scene_Base);

    function Scene_Title_new() {
      var _ref;

      _classCallCheck(this, Scene_Title_new);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(this, (_ref = Scene_Title_new.__proto__ || Object.getPrototypeOf(Scene_Title_new)).call.apply(_ref, [this].concat(args)));
    }

    _createClass(Scene_Title_new, [{
      key: "create",
      value: function create() {
        _get(Scene_Title_new.prototype.__proto__ || Object.getPrototypeOf(Scene_Title_new.prototype), "create", this).call(this);
        this.createBackground();
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
      }
    }, {
      key: "start",
      value: function start() {
        _get(Scene_Title_new.prototype.__proto__ || Object.getPrototypeOf(Scene_Title_new.prototype), "start", this).call(this);
        SceneManager.clearStack();
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
      }
    }, {
      key: "update",
      value: function update() {
        if (!this.isBusy()) {
          this._commandWindow.open();
        }
        _get(Scene_Title_new.prototype.__proto__ || Object.getPrototypeOf(Scene_Title_new.prototype), "update", this).call(this);
      }
    }, {
      key: "isBusy",
      value: function isBusy() {
        return this._commandWindow.isClosing() || _get(Scene_Title_new.prototype.__proto__ || Object.getPrototypeOf(Scene_Title_new.prototype), "isBusy", this).call(this);
      }
    }, {
      key: "terminate",
      value: function terminate() {
        _get(Scene_Title_new.prototype.__proto__ || Object.getPrototypeOf(Scene_Title_new.prototype), "terminate", this).call(this);
        SceneManager.snapForBackground();
      }
    }, {
      key: "createBackground",
      value: function createBackground() {
        this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
        this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
      }
    }, {
      key: "createForeground",
      value: function createForeground() {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
          this.drawGameTitle();
        }
      }
    }]);

    return Scene_Title_new;
  }(Scene_Base);

  window.Scene_Title_new = Scene_Title_new;
};
module.exports = hot_Scene_Title_new;

/***/ }),

/***/ "./src/hot_Sprite_Character.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Sprite_Character = function hot_Sprite_Character() {
  var Sprite_Character_prototype_initialize = Sprite_Character.prototype.initialize;
  Object.assign(Sprite_Character.prototype, {
    tilemap_index: function tilemap_index() {
      var _this = this;

      this._tilemap_index = SceneManager._scene._spriteset._tilemap.children.findIndex(function (n) {
        return n === _this;
      });
      return this._tilemap_index;
    },
    tilemap_reborn: function tilemap_reborn() {
      SceneManager._scene._spriteset._tilemap.children.splice(this._tilemap_index, 0, this);
    },
    tilemap_fake: function tilemap_fake() {
      SceneManager._scene._spriteset._tilemap.children.splice(this._tilemap_index, 0, new Sprite_Character($gamePlayer));
    },
    //new Sprite_Character($gamePlayer)===$gamePlayer._sprite_character //true //但是运行会出错
    tilemap_delete: function tilemap_delete() {
      SceneManager._scene._spriteset._tilemap.children.splice(this.tilemap_index(), 1);
    },
    tilemap_fake_add: function tilemap_fake_add() {
      SceneManager._scene._spriteset._tilemap.addChild(new Sprite_Character($gamePlayer));
      //用了addChild 代替直接操作数组，就避免了问题
    },
    tilemap_add: function tilemap_add() {
      SceneManager._scene._spriteset._tilemap.addChild(this);
    },
    tilemap_remove: function tilemap_remove() {
      SceneManager._scene._spriteset._tilemap.removeChild(this);
    },
    initialize: function initialize(character) {
      Sprite_Character_prototype_initialize.apply(this, arguments);
      character._sprite_character = this;
    }
  });
};
module.exports = hot_Sprite_Character;

/***/ }),

/***/ "./src/hot_Window_Bar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hot_Window_Bar = function hot_Window_Bar() {
  var Window_Bar = function (_Window_Base) {
    _inherits(Window_Bar, _Window_Base);

    function Window_Bar(character) {
      _classCallCheck(this, Window_Bar);

      var _this = _possibleConstructorReturn(this, (Window_Bar.__proto__ || Object.getPrototypeOf(Window_Bar)).call(this, character.screenX() - character._sprite_character._realFrame.width / 2, character.screenY() - character._sprite_character._realFrame.height * 1.5, 480, 480));
      //原来的构造函数就是原来的init


      _this._character = character;
      character._window_bar = _this;
      console.log(_this);
      //this.initialize.app
      //集成的类似乎不用init也能用？？？？，这样依然会调用修改后的init一次，从console.log可以看出，可能哪里不对
      //原来的写法会执行init2次
      //this.initialize(...args)
      return _this;
    }
    /*
    initialize(character){
      //super.initialize.apply(this, arguments)
      super.initialize.call(this,character._realX,character._realY,480,480)
      this._character=character
      character._window_bar=this
      console.log(this)
      }
    */


    _createClass(Window_Bar, [{
      key: 'windowLayer_add',
      value: function windowLayer_add() {
        SceneManager._scene.addWindow(this); //等同
        //SceneManager._scene._windowLayer.removeChild(this)//结果这个不行
      }
    }, {
      key: 'windowLayer_remove',
      value: function windowLayer_remove() {
        SceneManager._scene._windowLayer.removeChild(this);
      }
    }, {
      key: 'show',
      value: function show() {
        this.windowskin = ImageManager.loadSystem('');
        this.contents.fontSize = 12;
        this.contents.outlineWidth = 0;
        this.contents.textColor = 'red';
        this.contents.fontFace = 'Arial';
        //this.contents.fontFace='Consolas'
        var hp = this._character._hp ? this._character._hp : this._character._sprite_character._realFrame.width;
        var max_hp = this._character._max_hp ? this._character._max_hp : this._character._sprite_character._realFrame.width;
        this.drawText('▇'.repeat(hp) + '░'.repeat(max_hp - hp), 0, 0, 48, 'left');
      }
    }, {
      key: 'update',
      value: function update() {
        this._isWindow = false;
        this._margin = 0;
        this._padding = 0;
        this.contents.clear();
        //this.move($gamePlayer.screenX()-width/2,$gamePlayer.screenY()-height/2-50,500,500)
        this.move(this._character.screenX() - this._character._sprite_character._realFrame.width / 2, this._character.screenY() - this._character._sprite_character._realFrame.height * 1.5, 480, 480);
        this.show();
      }
    }]);

    return Window_Bar;
  }(Window_Base);

  window.Window_Bar = Window_Bar;
};
module.exports = hot_Window_Bar;

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hot_Input = __webpack_require__("./src/hot_Input.js");
hot_Input();
var hot_Game_Character = __webpack_require__("./src/hot_Game_Character.js");
hot_Game_Character();
var hot_Game_Player = __webpack_require__("./src/hot_Game_Player.js");
hot_Game_Player();
var hot_Game_Event = __webpack_require__("./src/hot_Game_Event.js");
hot_Game_Event();
var hot_Game_Map = __webpack_require__("./src/hot_Game_Map.js");
hot_Game_Map();
var hot_Game_Interpreter = __webpack_require__("./src/hot_Game_Interpreter.js");
hot_Game_Interpreter();
var hot_Window_Bar = __webpack_require__("./src/hot_Window_Bar.js");
hot_Window_Bar();
var hot_Scene_Title_new = __webpack_require__("./src/hot_Scene_Title_new.js");
hot_Scene_Title_new();
var hot_Scene_Boot = __webpack_require__("./src/hot_Scene_Boot.js");
hot_Scene_Boot();
var hot_Sprite_Character = __webpack_require__("./src/hot_Sprite_Character.js");
hot_Sprite_Character();
var hot_Scene_Map = __webpack_require__("./src/hot_Scene_Map.js");
hot_Scene_Map();

if (true) {
  module.hot.accept("./src/hot_Game_Event.js", function () {
    hot_Game_Event = __webpack_require__("./src/hot_Game_Event.js");
    hot_Game_Event();
  });
  module.hot.accept("./src/hot_Game_Interpreter.js", function () {
    hot_Game_Interpreter = __webpack_require__("./src/hot_Game_Interpreter.js");
    hot_Game_Interpreter();
  });
  module.hot.accept("./src/hot_Scene_Boot.js", function () {
    hot_Scene_Boot = __webpack_require__("./src/hot_Scene_Boot.js");
    hot_Scene_Boot();
  });
  module.hot.accept("./src/hot_Scene_Map.js", function () {
    hot_Scene_Map = __webpack_require__("./src/hot_Scene_Map.js");
    hot_Scene_Map();
  });
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2IwYWEyNDhhZGM4ODE1Y2ZkM2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvdF9HYW1lX0NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaG90X0dhbWVfRXZlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvdF9HYW1lX0ludGVycHJldGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9ob3RfR2FtZV9NYXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvdF9HYW1lX1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaG90X0lucHV0LmpzIiwid2VicGFjazovLy8uL3NyYy9ob3RfU2NlbmVfQm9vdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaG90X1NjZW5lX01hcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaG90X1NjZW5lX1RpdGxlX25ldy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaG90X1Nwcml0ZV9DaGFyYWN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvdF9XaW5kb3dfQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJob3RfR2FtZV9DaGFyYWN0ZXIiLCJPYmplY3QiLCJhc3NpZ24iLCJHYW1lX0NoYXJhY3RlciIsInByb3RvdHlwZSIsImRpc3RhbmNlRnJvbUNoYXJhY3RlciIsImNoYXJhY3RlciIsIk1hdGgiLCJhYnMiLCJkZWx0YVhGcm9tIiwieCIsImRlbHRhWUZyb20iLCJ5IiwicnVuU3RyYWlnaHQiLCJzdGVwIiwic2V0TW92ZW1lbnRTdWNjZXNzIiwiY2FuUGFzcyIsIl94IiwiX3kiLCJfZGlyZWN0aW9uIiwiaXNNb3ZlbWVudFN1Y2NlZWRlZCIsIiRnYW1lTWFwIiwicm91bmRYV2l0aERpcmVjdGlvbiIsInJvdW5kWVdpdGhEaXJlY3Rpb24iLCJpbmNyZWFzZVN0ZXBzIiwiY2hlY2tFdmVudFRyaWdnZXJUb3VjaEZyb250IiwiY2FuSnVtcCIsIl9yZWFsWCIsIl9yZWFsWSIsImQiLCJ4MiIsInkyIiwianVtcFN0cmFpZ2h0Iiwic2V0RGlyZWN0aW9uIiwic2tpbGxKdW1wIiwiaXNKdW1waW5nIiwianVtcCIsImlzU2tpbGxpbmciLCJza2lsbENoYXJhY3RlciIsImlkIiwiTnVtYmVyIiwiJGRhdGFNYXAiLCJldmVudHMiLCJsZW5ndGgiLCJwdXNoIiwiX2V2ZW50cyIsIkdhbWVfRXZlbnQiLCJfbWFwSWQiLCJTY2VuZU1hbmFnZXIiLCJfc2NlbmUiLCJfc3ByaXRlc2V0IiwiX3RpbGVtYXAiLCJhZGRDaGlsZCIsIlNwcml0ZV9DaGFyYWN0ZXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiaG90X0dhbWVfRXZlbnQiLCJKdW1wVHlwZVJhbmRvbSIsInJhbmRvbUludCIsIkp1bXBSYW5kb20iLCJyZXNldFN0b3BDb3VudCIsInVwZGF0ZVNlbGZNb3ZlbWVudCIsIl9sb2NrZWQiLCJpc05lYXJUaGVTY3JlZW4iLCJjaGVja1N0b3AiLCJzdG9wQ291bnRUaHJlc2hvbGQiLCJfbW92ZVR5cGUiLCJtb3ZlVHlwZVJhbmRvbSIsIm1vdmVUeXBlVG93YXJkUGxheWVyIiwibW92ZVR5cGVDdXN0b20iLCJtb3ZlQXdheUZyb21QbGF5ZXIiLCJob3RfR2FtZV9JbnRlcnByZXRlciIsIkdhbWVfSW50ZXJwcmV0ZXIiLCLmnKzkvZMiLCJjb21tYW5kIiwiY29uc29sZSIsImxvZyIsIl9zZWxmIiwiX2V2ZW50SWQiLCJlcmFzZSIsImNsZWFyUGFnZVNldHRpbmdzIiwibG9jYXRlIiwiJGdhbWVQbGF5ZXIiLCJpc01vdmluZyIsIm1vdmVUb3dhcmRDaGFyYWN0ZXIiLCJob3RfR2FtZV9NYXAiLCJHYW1lX01hcCIsInRpbGVXaWR0aCIsInRpbGVIZWlnaHQiLCJob3RfR2FtZV9QbGF5ZXIiLCJHYW1lX1BsYXllcl9wcm90b3R5cGVfdXBkYXRlIiwiR2FtZV9QbGF5ZXIiLCJ1cGRhdGUiLCJhcHBseSIsImFyZ3VtZW50cyIsImhvdF9JbnB1dCIsIklucHV0Iiwia2V5TWFwcGVyIiwiaG90X1NjZW5lX0Jvb3QiLCJTY2VuZV9Cb290Iiwic3RhcnQiLCJTY2VuZV9CYXNlIiwiY2FsbCIsIlNvdW5kTWFuYWdlciIsInByZWxvYWRJbXBvcnRhbnRTb3VuZHMiLCJEYXRhTWFuYWdlciIsImlzQmF0dGxlVGVzdCIsInNldHVwQmF0dGxlVGVzdCIsImdvdG8iLCJTY2VuZV9CYXR0bGUiLCJpc0V2ZW50VGVzdCIsInNldHVwRXZlbnRUZXN0IiwiU2NlbmVfTWFwIiwiY2hlY2tQbGF5ZXJMb2NhdGlvbiIsInNldHVwTmV3R2FtZSIsIldpbmRvd19UaXRsZUNvbW1hbmQiLCJpbml0Q29tbWFuZFBvc2l0aW9uIiwidXBkYXRlRG9jdW1lbnRUaXRsZSIsImhvdF9TY2VuZV9NYXAiLCJTY2VuZV9NYXBfcHJvdG90eXBlX3VwZGF0ZSIsIlNjZW5lX01hcF9jcmVhdGVBbGxXaW5kb3dzIiwiY3JlYXRlQWxsV2luZG93cyIsImRpc0Zyb21DaGFyYWN0ZXIiLCJjaGFyYWN0ZXJfMSIsImNoYXJhY3Rlcl8yIiwiZGVsdGFYIiwiZGVsdGFZIiwiYWRkV2luZG93IiwiV2luZG93X0JhciIsIl9lIiwiaXNQcmVzc2VkIiwic2V0TW92ZVNwZWVkIiwibW92ZVN0cmFpZ2h0IiwiY2hpbGRyZW4iLCJzcGxpY2UiLCJhbmltYXRpb24iLCIkZGF0YUFuaW1hdGlvbnMiLCJuYW1lMSIsImFuaW1hdGlvbjFOYW1lIiwibmFtZTIiLCJhbmltYXRpb24yTmFtZSIsImh1ZTEiLCJhbmltYXRpb24xSHVlIiwiaHVlMiIsImFuaW1hdGlvbjJIdWUiLCJJbWFnZU1hbmFnZXIiLCJyZXF1ZXN0QW5pbWF0aW9uIiwiaG90X1NjZW5lX1RpdGxlX25ldyIsIlNjZW5lX1RpdGxlX25ldyIsImFyZ3MiLCJjcmVhdGVCYWNrZ3JvdW5kIiwiY3JlYXRlRm9yZWdyb3VuZCIsImNyZWF0ZVdpbmRvd0xheWVyIiwiY3JlYXRlQ29tbWFuZFdpbmRvdyIsImNsZWFyU3RhY2siLCJjZW50ZXJTcHJpdGUiLCJfYmFja1Nwcml0ZTEiLCJfYmFja1Nwcml0ZTIiLCJwbGF5VGl0bGVNdXNpYyIsInN0YXJ0RmFkZUluIiwiZmFkZVNwZWVkIiwiaXNCdXN5IiwiX2NvbW1hbmRXaW5kb3ciLCJvcGVuIiwiaXNDbG9zaW5nIiwic25hcEZvckJhY2tncm91bmQiLCJTcHJpdGUiLCJsb2FkVGl0bGUxIiwiJGRhdGFTeXN0ZW0iLCJ0aXRsZTFOYW1lIiwibG9hZFRpdGxlMiIsInRpdGxlMk5hbWUiLCJfZ2FtZVRpdGxlU3ByaXRlIiwiQml0bWFwIiwiR3JhcGhpY3MiLCJ3aWR0aCIsImhlaWdodCIsIm9wdERyYXdUaXRsZSIsImRyYXdHYW1lVGl0bGUiLCJ3aW5kb3ciLCJob3RfU3ByaXRlX0NoYXJhY3RlciIsIlNwcml0ZV9DaGFyYWN0ZXJfcHJvdG90eXBlX2luaXRpYWxpemUiLCJpbml0aWFsaXplIiwidGlsZW1hcF9pbmRleCIsIl90aWxlbWFwX2luZGV4IiwiZmluZEluZGV4IiwibiIsInRpbGVtYXBfcmVib3JuIiwidGlsZW1hcF9mYWtlIiwidGlsZW1hcF9kZWxldGUiLCJ0aWxlbWFwX2Zha2VfYWRkIiwidGlsZW1hcF9hZGQiLCJ0aWxlbWFwX3JlbW92ZSIsInJlbW92ZUNoaWxkIiwiX3Nwcml0ZV9jaGFyYWN0ZXIiLCJob3RfV2luZG93X0JhciIsInNjcmVlblgiLCJfcmVhbEZyYW1lIiwic2NyZWVuWSIsIl9jaGFyYWN0ZXIiLCJfd2luZG93X2JhciIsIl93aW5kb3dMYXllciIsIndpbmRvd3NraW4iLCJsb2FkU3lzdGVtIiwiY29udGVudHMiLCJmb250U2l6ZSIsIm91dGxpbmVXaWR0aCIsInRleHRDb2xvciIsImZvbnRGYWNlIiwiaHAiLCJfaHAiLCJtYXhfaHAiLCJfbWF4X2hwIiwiZHJhd1RleHQiLCJyZXBlYXQiLCJfaXNXaW5kb3ciLCJfbWFyZ2luIiwiX3BhZGRpbmciLCJjbGVhciIsIm1vdmUiLCJzaG93IiwiV2luZG93X0Jhc2UiLCJyZXF1aXJlIiwiaG90IiwiYWNjZXB0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMENBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7OztBQUlBO0FBQ0Esc0RBQThDO0FBQzlDO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0EsYUFBSztBQUNMLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBYSw0QkFBNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWUsdUNBQXVDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZSxzQkFBc0I7QUFDckM7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQWEsd0NBQXdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Q0FBZjtBQUNBNUg7QUFDRCxHQUhEO0FBSUE1QyxTQUFPeUssR0FBUCxDQUFXQyxNQUFYLENBQWtCLHdCQUFsQixFQUF1QyxZQUFZO0FBQ2pEMUcsb0JBQWMsbUJBQUF3RyxDQUFRLHdCQUFSLENBQWQ7QUFDQXhHO0FBQ0QsR0FIRDtBQUlELEMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IDEwMDAwO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIzYjBhYTI0OGFkYzg4MTVjZmQzZFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9qcy9wbHVnaW5zL1wiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKFwiLi9zcmMvaW5kZXguanNcIikoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzYjBhYTI0OGFkYzg4MTVjZmQzZCIsImxldCBob3RfR2FtZV9DaGFyYWN0ZXI9KCk9PntcclxuICBPYmplY3QuYXNzaWduKEdhbWVfQ2hhcmFjdGVyLnByb3RvdHlwZSx7XHJcbiAgICBkaXN0YW5jZUZyb21DaGFyYWN0ZXIoY2hhcmFjdGVyKXtcclxuICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuZGVsdGFYRnJvbShjaGFyYWN0ZXIueCkpICsgTWF0aC5hYnModGhpcy5kZWx0YVlGcm9tKGNoYXJhY3Rlci55KSlcclxuICAgIH0sXHJcbiAgICBydW5TdHJhaWdodChzdGVwPTIpIHtcclxuICAgICAgdGhpcy5zZXRNb3ZlbWVudFN1Y2Nlc3ModGhpcy5jYW5QYXNzKHRoaXMuX3gsIHRoaXMuX3ksIHRoaXMuX2RpcmVjdGlvbikpO1xyXG4gICAgICBpZiAodGhpcy5pc01vdmVtZW50U3VjY2VlZGVkKCkpIHtcclxuICAgICAgICAvL3RoaXMuc2V0RGlyZWN0aW9uKHRoaXMuX2RpcmVjdGlvbilcclxuICAgICAgICB0aGlzLl94ICs9JGdhbWVNYXAucm91bmRYV2l0aERpcmVjdGlvbigwLCB0aGlzLl9kaXJlY3Rpb24pKnN0ZXBcclxuICAgICAgICB0aGlzLl95ICs9JGdhbWVNYXAucm91bmRZV2l0aERpcmVjdGlvbigwLCB0aGlzLl9kaXJlY3Rpb24pKnN0ZXBcclxuICAgICAgICAvL3RoaXMuX3JlYWxYID0gJGdhbWVNYXAueFdpdGhEaXJlY3Rpb24odGhpcy5feCwgdGhpcy5yZXZlcnNlRGlyKHRoaXMuX2RpcmVjdGlvbikpXHJcbiAgICAgICAgLy90aGlzLl9yZWFsWSA9ICRnYW1lTWFwLnlXaXRoRGlyZWN0aW9uKHRoaXMuX3ksIHRoaXMucmV2ZXJzZURpcih0aGlzLl9kaXJlY3Rpb24pKVxyXG4gICAgICAgIHRoaXMuaW5jcmVhc2VTdGVwcygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy90aGlzLnNldERpcmVjdGlvbih0aGlzLl9kaXJlY3Rpb24pXHJcbiAgICAgICAgdGhpcy5jaGVja0V2ZW50VHJpZ2dlclRvdWNoRnJvbnQodGhpcy5fZGlyZWN0aW9uKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY2FuSnVtcCh4PXRoaXMuX3JlYWxYLCB5PXRoaXMuX3JlYWxZLCBkPXRoaXMuX2RpcmVjdGlvbiwgc3RlcD0yKSB7XHJcbiAgICAgIC8vbGV0IHgyID0geCsgJGdhbWVNYXAucm91bmRYV2l0aERpcmVjdGlvbigwLCBkKSooc3RlcC0xKSAvL+WFtuS4reS4gOenjeaDheWGteS8muWHuumUmVxyXG4gICAgICAvL2xldCB5MiA9IHkrICRnYW1lTWFwLnJvdW5kWVdpdGhEaXJlY3Rpb24oMCwgZCkqKHN0ZXAtMSkgLy/lhbbkuK3kuIDnp43mg4XlhrXkvJrlh7rplJlcclxuICAgICAgbGV0IHgyID0kZ2FtZU1hcC5yb3VuZFhXaXRoRGlyZWN0aW9uKHgsIGQpXHJcbiAgICAgIGxldCB5MiA9JGdhbWVNYXAucm91bmRZV2l0aERpcmVjdGlvbih5LCBkKVxyXG4gICAgICAvKi8v56ys5LiA5Liq5Yik5a6a5Yaz5a6a5piv5ZCm6IO96LaK6L+H54mp5L2TLOWKoOS6huWIpOWumuetieWQju+8jOacieaXtuWAmeS8muWNoeS9j+S4jeiDvemHiuaUvlxyXG4gICAgICBpZiAoIXRoaXMuY2FuUGFzcyh4LHksZCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgICAqL1xyXG4gICAgICBpZiAoIXRoaXMuY2FuUGFzcyh4Mix5MixkKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9LFxyXG4gICAgLypcclxuICAgIGNhbkp1bXAoeCwgeSwgZCwgc3RlcD0yKSB7XHJcbiAgICAgIGxldCB4MiA9IHgrICRnYW1lTWFwLnJvdW5kWFdpdGhEaXJlY3Rpb24oMCwgZCkqc3RlcFxyXG4gICAgICBsZXQgeTIgPSB5KyAkZ2FtZU1hcC5yb3VuZFlXaXRoRGlyZWN0aW9uKDAsIGQpKnN0ZXBcclxuICAgICAgaWYgKCEkZ2FtZU1hcC5pc1ZhbGlkKHgyLCB5MikpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pc1Rocm91Z2goKSB8fCB0aGlzLmlzRGVidWdUaHJvdWdoKCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy5pc01hcFBhc3NhYmxlKHgsIHksIGQpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaXNDb2xsaWRlZFdpdGhDaGFyYWN0ZXJzKHgyLCB5MikpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICAqL1xyXG4gICAganVtcFN0cmFpZ2h0IChkPXRoaXMuX2RpcmVjdGlvbikge1xyXG4gICAgICB0aGlzLnNldE1vdmVtZW50U3VjY2Vzcyh0aGlzLmNhbkp1bXAodGhpcy5feCwgdGhpcy5feSwgZCkpXHJcbiAgICAgIGlmICh0aGlzLmlzTW92ZW1lbnRTdWNjZWVkZWQoKSkge1xyXG4gICAgICAgIHRoaXMuc2V0RGlyZWN0aW9uKGQpXHJcbiAgICAgICAgdGhpcy5za2lsbEp1bXAoZClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNldERpcmVjdGlvbihkKVxyXG4gICAgICAgIHRoaXMuY2hlY2tFdmVudFRyaWdnZXJUb3VjaEZyb250KGQpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBza2lsbEp1bXAoZD10aGlzLl9kaXJlY3Rpb24sc3RlcD0yKXtcclxuICAgICAgaWYoIXRoaXMuaXNKdW1waW5nKCkpe1xyXG4gICAgICAgIHN3aXRjaChkKXtcclxuICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgdGhpcy5qdW1wKDAsLTEqc3RlcClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgdGhpcy5qdW1wKDAsMSpzdGVwKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICB0aGlzLmp1bXAoLTEqc3RlcCwwKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICB0aGlzLmp1bXAoMSpzdGVwLDApXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNTa2lsbGluZygpe1xyXG5cclxuICAgIH0sXHJcbiAgICBza2lsbENoYXJhY3Rlcigpe1xyXG4gICAgICBsZXQgaWQ9TnVtYmVyKCRkYXRhTWFwLmV2ZW50cy5sZW5ndGgpXHJcbiAgICAgIGxldCB4PU51bWJlcigkZ2FtZU1hcC5yb3VuZFhXaXRoRGlyZWN0aW9uKHRoaXMuX3gsIHRoaXMuX2RpcmVjdGlvbikpXHJcbiAgICAgIGxldCB5PU51bWJlcigkZ2FtZU1hcC5yb3VuZFlXaXRoRGlyZWN0aW9uKHRoaXMuX3ksIHRoaXMuX2RpcmVjdGlvbikpXHJcbiAgICAgIC8vbGV0IHk9TnVtYmVyKHRoaXMuX3JlYWxZKzEpXHJcbiAgICAgIC8v5Lyq6YCg55Sf5oiQ5Yid5aeL55qE5Zyw5Zu+5LiK5LqL5Lu25pWw5o2uXHJcbiAgICAgIC8v54S25ZCO5Zyo5a6e6ZmF55qE5Zyw5Zu+5Lit5L6d5o2u5pWw5o2u55Sf5oiQ5LqL5Lu2XHJcbiAgICAgIC8v55So5LqL5Lu255Sf5oiQ5Yqg5YWl5Zy65pmv5Lit55qE57K+54G16ZuG5Lit55qE6KeS6Imy5Zyf5Z2XXHJcbiAgICAgIC8vcHVzaOeahOWAvOW6lOivpeeUqOexu+adpeeUn+aIkCzlubbkuJTnlKh0aGlzLnjmnaXkvb/nlKhcclxuICAgICAgJGRhdGFNYXAuZXZlbnRzLnB1c2goe1xyXG4gICAgICAgIFwiaWRcIjogaWQsXHJcbiAgICAgICAgXCJuYW1lXCI6IFwiRVYwMFwiK2lkLFxyXG4gICAgICAgIFwibm90ZVwiOiBcIlwiLFxyXG4gICAgICAgIFwicGFnZXNcIjogW3tcclxuICAgICAgICBcImNvbmRpdGlvbnNcIjoge1xyXG4gICAgICAgICAgXCJhY3RvcklkXCI6IDEsXHJcbiAgICAgICAgICBcImFjdG9yVmFsaWRcIjogZmFsc2UsXHJcbiAgICAgICAgICBcIml0ZW1JZFwiOiAxLFxyXG4gICAgICAgICAgXCJpdGVtVmFsaWRcIjogZmFsc2UsXHJcbiAgICAgICAgICBcInNlbGZTd2l0Y2hDaFwiOiBcIkFcIixcclxuICAgICAgICAgIFwic2VsZlN3aXRjaFZhbGlkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgXCJzd2l0Y2gxSWRcIjogMSxcclxuICAgICAgICAgIFwic3dpdGNoMVZhbGlkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgXCJzd2l0Y2gySWRcIjogMSxcclxuICAgICAgICAgIFwic3dpdGNoMlZhbGlkXCI6IGZhbHNlLFxyXG4gICAgICAgICAgXCJ2YXJpYWJsZUlkXCI6IDEsXHJcbiAgICAgICAgICBcInZhcmlhYmxlVmFsaWRcIjogZmFsc2UsXHJcbiAgICAgICAgICBcInZhcmlhYmxlVmFsdWVcIjogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJkaXJlY3Rpb25GaXhcIjogdHJ1ZSxcclxuICAgICAgICBcImltYWdlXCI6IHtcclxuICAgICAgICAgIFwidGlsZUlkXCI6IDAsXHJcbiAgICAgICAgICBcImNoYXJhY3Rlck5hbWVcIjogXCIhRG9vcjJcIixcclxuICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IDgsXHJcbiAgICAgICAgICBcInBhdHRlcm5cIjogMCxcclxuICAgICAgICAgIFwiY2hhcmFjdGVySW5kZXhcIjogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJsaXN0XCI6IFt7XHJcbiAgICAgICAgICBcImNvZGVcIjogMCxcclxuICAgICAgICAgIFwiaW5kZW50XCI6IDAsXHJcbiAgICAgICAgICBcInBhcmFtZXRlcnNcIjogW11cclxuICAgICAgICB9XSxcclxuICAgICAgICBcIm1vdmVGcmVxdWVuY3lcIjogMTAsXHJcbiAgICAgICAgXCJtb3ZlUm91dGVcIjoge1xyXG4gICAgICAgICAgXCJsaXN0XCI6IFt7XHJcbiAgICAgICAgICAgIFwiY29kZVwiOiAwLFxyXG4gICAgICAgICAgICBcInBhcmFtZXRlcnNcIjogW11cclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgXCJyZXBlYXRcIjogdHJ1ZSxcclxuICAgICAgICAgIFwic2tpcHBhYmxlXCI6IGZhbHNlLFxyXG4gICAgICAgICAgXCJ3YWl0XCI6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcIm1vdmVTcGVlZFwiOiAzLFxyXG4gICAgICAgIFwibW92ZVR5cGVcIjogMixcclxuICAgICAgICBcInByaW9yaXR5VHlwZVwiOiAxLFxyXG4gICAgICAgIFwic3RlcEFuaW1lXCI6IHRydWUsXHJcbiAgICAgICAgXCJ0aHJvdWdoXCI6IHRydWUsXHJcbiAgICAgICAgXCJ0cmlnZ2VyXCI6IDAsXHJcbiAgICAgICAgXCJ3YWxrQW5pbWVcIjogdHJ1ZVxyXG4gICAgICB9XSxcclxuICAgICAgICBcInhcIjogeCxcclxuICAgICAgICBcInlcIjogeVxyXG4gICAgICB9KVxyXG4gICAgICAkZ2FtZU1hcC5fZXZlbnRzLnB1c2gobmV3IEdhbWVfRXZlbnQoJGdhbWVNYXAuX21hcElkLCBpZCkpXHJcbiAgICAgIFNjZW5lTWFuYWdlci5fc2NlbmUuX3Nwcml0ZXNldC5fdGlsZW1hcC5hZGRDaGlsZChuZXcgU3ByaXRlX0NoYXJhY3RlcigkZ2FtZU1hcC5fZXZlbnRzWyRnYW1lTWFwLl9ldmVudHMubGVuZ3RoLTFdKSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcbm1vZHVsZS5leHBvcnRzPWhvdF9HYW1lX0NoYXJhY3RlclxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaG90X0dhbWVfQ2hhcmFjdGVyLmpzIiwibGV0IGhvdF9HYW1lX0V2ZW50PSgpPT57XHJcbiAgT2JqZWN0LmFzc2lnbihHYW1lX0V2ZW50LnByb3RvdHlwZSx7XHJcbiAgICBKdW1wVHlwZVJhbmRvbSgpIHtcclxuICAgICAgc3dpdGNoIChNYXRoLnJhbmRvbUludCg2KSkge1xyXG4gICAgICAgIGNhc2UgMDogY2FzZSAxOlxyXG4gICAgICAgIHRoaXMuSnVtcFJhbmRvbSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjogY2FzZSAzOiBjYXNlIDQ6XHJcbiAgICAgICAgdGhpcy5qdW1wU3RyYWlnaHQoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICB0aGlzLnJlc2V0U3RvcENvdW50KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIEp1bXBSYW5kb20oKSB7XHJcbiAgICAgIHZhciBkID0gMiArIE1hdGgucmFuZG9tSW50KDQpICogMjtcclxuICAgICAgaWYgKHRoaXMuY2FuSnVtcCh0aGlzLngsIHRoaXMueSwgZCkpIHtcclxuICAgICAgICB0aGlzLnNraWxsSnVtcChkKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVNlbGZNb3ZlbWVudCgpIHtcclxuICAgICAgaWYgKCF0aGlzLl9sb2NrZWQgJiYgdGhpcy5pc05lYXJUaGVTY3JlZW4oKSAmJlxyXG4gICAgICB0aGlzLmNoZWNrU3RvcCh0aGlzLnN0b3BDb3VudFRocmVzaG9sZCgpKSkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5fbW92ZVR5cGUpIHtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgdGhpcy5tb3ZlVHlwZVJhbmRvbSgpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICB0aGlzLm1vdmVUeXBlVG93YXJkUGxheWVyKClcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVR5cGVDdXN0b20oKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgdGhpcy5tb3ZlQXdheUZyb21QbGF5ZXIoKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICB0aGlzLkp1bXBUeXBlUmFuZG9tKClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvKlxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICAgIEdhbWVfQ2hhcmFjdGVyLnByb3RvdHlwZS51cGRhdGUuY2FsbCh0aGlzKTtcclxuICAgICAgdGhpcy5jaGVja0V2ZW50VHJpZ2dlckF1dG8oKTtcclxuICAgICAgdGhpcy51cGRhdGVQYXJhbGxlbCgpO1xyXG4gICAgICB0aGlzLl9lcmFzZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgIH1cclxuICAgICovXHJcbiAgfSlcclxufVxyXG5tb2R1bGUuZXhwb3J0cz1ob3RfR2FtZV9FdmVudFxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaG90X0dhbWVfRXZlbnQuanMiLCJsZXQgaG90X0dhbWVfSW50ZXJwcmV0ZXI9KCk9PntcclxuICBPYmplY3QuYXNzaWduKEdhbWVfSW50ZXJwcmV0ZXIucHJvdG90eXBlLHtcclxuICAgIOacrOS9kyhjb21tYW5kKXtcclxuICAgICAgc3dpdGNoKGNvbW1hbmQpe1xyXG4gICAgICAgIGNhc2UgXCLot7NcIjpcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCflvIDlp4vot7MnKVxyXG4gICAgICAgICAgdGhpcy5fc2VsZigpLl9tb3ZlVHlwZT01XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgXCLov5znprtcIjpcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCflvIDlp4vov5znprsnKVxyXG4gICAgICAgICAgdGhpcy5fc2VsZigpLl9tb3ZlVHlwZT00XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIFwi5raI5aSxXCI6XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9ldmVudElkKVxyXG4gICAgICAgICAgdGhpcy5fc2VsZigpLmVyYXNlKClcclxuICAgICAgICAgIC8vJGdhbWVNYXAuX2V2ZW50cy5zcGxpY2UodGhpcy5fZXZlbnRJZCwxKVxyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZygkZ2FtZU1hcC5fZXZlbnRzKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSBcImtpbGxcIjpcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLl9ldmVudElkKVxyXG4gICAgICAgIHRoaXMuX3NlbGYoKS5jbGVhclBhZ2VTZXR0aW5ncygpXHJcbiAgICAgICAgLy8kZ2FtZU1hcC5fZXZlbnRzLnNwbGljZSh0aGlzLl9ldmVudElkLDEpXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygkZ2FtZU1hcC5fZXZlbnRzKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSBcIuW9kuS9jVwiOlxyXG4gICAgICAgIHRoaXMuX3NlbGYoKS5sb2NhdGUoMSwxKVxyXG4gICAgICAgIC8vJGdhbWVNYXAuX2V2ZW50cy5zcGxpY2UodGhpcy5fZXZlbnRJZCwxKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJGdhbWVNYXAuX2V2ZW50cylcclxuICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgXCLmoIforrBcIjpcclxuICAgICAgICBpZighJGdhbWVQbGF5ZXIuaXNNb3ZpbmcoKSl7XHJcbiAgICAgICAgICAkZ2FtZVBsYXllci5tb3ZlVG93YXJkQ2hhcmFjdGVyKHRoaXMuX3NlbGYoKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgICAvL2NvbnNvbGUubG9nKCfnnJ/lrp7lnZDmoId4JyskZ2FtZU1hcC5fZXZlbnRzW3RoaXMuX2V2ZW50SWRdLl9yZWFsWClcclxuICAgIH0sXHJcbiAgICBfc2VsZigpe1xyXG4gICAgICByZXR1cm4gJGdhbWVNYXAuX2V2ZW50c1t0aGlzLl9ldmVudElkXVxyXG4gICAgfSxcclxuICB9KVxyXG59XHJcbm1vZHVsZS5leHBvcnRzPWhvdF9HYW1lX0ludGVycHJldGVyXHJcblxyXG5cclxuLy/lnKjkuovku7bpobXpnaLnm7TmjqXorr7lrprohJrmnKwgdGhpcy7mnKzkvZMoKSDljbPlj6/miafooYxcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hvdF9HYW1lX0ludGVycHJldGVyLmpzIiwibGV0IGhvdF9HYW1lX01hcD0oKT0+e1xyXG4gIC8vbGV0IEdhbXBfTWFwX3Byb3RvdHlwZV90aWxlV2lkdGg9R2FtZV9NYXAucHJvdG90eXBlLnRpbGVXaWR0aFxyXG4gIC8vbGV0IEdhbXBfTWFwX3Byb3RvdHlwZV90aWxlSGVpZ2h0PUdhbWVfTWFwLnByb3RvdHlwZS50aWxlSGVpZ2h0XHJcbiAgT2JqZWN0LmFzc2lnbihHYW1lX01hcC5wcm90b3R5cGUse1xyXG4gICAgdGlsZVdpZHRoKCl7XHJcbiAgICAgIHJldHVybiA0OFxyXG4gICAgfSxcclxuICAgIHRpbGVIZWlnaHQoKXtcclxuICAgICAgcmV0dXJuIDQ4XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5tb2R1bGUuZXhwb3J0cz1ob3RfR2FtZV9NYXBcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hvdF9HYW1lX01hcC5qcyIsImxldCBob3RfR2FtZV9QbGF5ZXI9KCk9PntcclxuICBsZXQgR2FtZV9QbGF5ZXJfcHJvdG90eXBlX3VwZGF0ZT1HYW1lX1BsYXllci5wcm90b3R5cGUudXBkYXRlXHJcbiAgLypcclxuICBHYW1lX1BsYXllci5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBHYW1lX1BsYXllcl9wcm90b3R5cGVfdXBkYXRlLmNhbGwodGhpcylcclxuICB9XHJcbiAgLy/kuKTnp43mlrnms5XlnKhob3TliqDovb3nmoTnjq/looPkuK3pg73kuI3og73lho3mraPluLjov5DooYzvvIzkurrniankvJrljaHlm75cclxuICAvL+a1i+ivleWPkeeOsOWNs+S9v+S4jeaUvui/m+WOu+S5n+S8muWNoeWbvlxyXG4gICovXHJcbiAgLy9lcnJvciBjcmVhdGVBcnJheSBlcnJvclxyXG4gIE9iamVjdC5hc3NpZ24oR2FtZV9QbGF5ZXIucHJvdG90eXBlLHtcclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICBHYW1lX1BsYXllcl9wcm90b3R5cGVfdXBkYXRlLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxyXG4gICAgICAvKlxyXG4gICAgICBpZihJbnB1dC5pc1ByZXNzZWQoJ2NvbnRyb2wnKSl7XHJcbiAgICAgICAgZm9yKGxldCBfZSBvZiAkZ2FtZU1hcC5fZXZlbnRzKXtcclxuICAgICAgICAgIGlmKCFfZSl7XHJcblxyXG4gICAgICAgICAgfWVsc2UgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+acieS6i+S7ticpXHJcbiAgICAgICAgICAgIGlmKCFfZS5fZXJhc2Upe1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfmsqHlh73mlbAnKVxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coX2UpXHJcbiAgICAgICAgICAgICAgX2UuX2VyYXNlKCkvL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJGdhbWVNYXAuX2V2ZW50cylcclxuICAgICAgICAvL+WOn+adpWVycm9y5piv5Ye65Zyo56ys5LiA5Liq5piv56m655qEXHJcbiAgICAgIH1cclxuICAgICAgLy9jb25zb2xlLmxvZygxKVxyXG4gICAgICAqL1xyXG4gICAgfVxyXG4gIH0pXHJcblxyXG59XHJcbm1vZHVsZS5leHBvcnRzPWhvdF9HYW1lX1BsYXllclxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaG90X0dhbWVfUGxheWVyLmpzIiwibGV0IGhvdF9JbnB1dD0oKT0+e1xyXG4gIElucHV0LmtleU1hcHBlciA9IHtcclxuICAgIDk6ICd0YWInLCAgICAgICAvLyB0YWJcclxuICAgIDEzOiAnb2snLCAgICAgICAvLyBlbnRlclxyXG4gICAgMTY6ICdzaGlmdCcsICAgIC8vIHNoaWZ0XHJcbiAgICAxNzogJ2NvbnRyb2wnLCAgLy8gY29udHJvbFxyXG4gICAgMTg6ICdjb250cm9sJywgIC8vIGFsdFxyXG4gICAgMjc6ICdlc2NhcGUnLCAgIC8vIGVzY2FwZVxyXG4gICAgMzI6ICdzcGFjZScsICAgIC8vIHNwYWNlXHJcbiAgICAzMzogJ3BhZ2V1cCcsICAgLy8gcGFnZXVwXHJcbiAgICAzNDogJ3BhZ2Vkb3duJywgLy8gcGFnZWRvd25cclxuICAgIDM3OiAnbGVmdCcsICAgICAvLyBsZWZ0IGFycm93XHJcbiAgICAzODogJ3VwJywgICAgICAgLy8gdXAgYXJyb3dcclxuICAgIDM5OiAncmlnaHQnLCAgICAvLyByaWdodCBhcnJvd1xyXG4gICAgNDA6ICdkb3duJywgICAgIC8vIGRvd24gYXJyb3dcclxuICAgIDQ1OiAnZXNjYXBlJywgICAvLyBpbnNlcnRcclxuICAgIDcwOiAnZicsICAgICAgICAvLyBmXHJcbiAgICA3MjogJ2gnLCAgICAgICAgLy8gaFxyXG4gICAgODE6ICdwYWdldXAnLCAgIC8vIFFcclxuICAgIDg3OiAncGFnZWRvd24nLCAvLyBXXHJcbiAgICA4ODogJ2VzY2FwZScsICAgLy8gWFxyXG4gICAgOTA6ICdvaycsICAgICAgIC8vIFpcclxuICAgIDk2OiAnZXNjYXBlJywgICAvLyBudW1wYWQgMFxyXG4gICAgOTg6ICdkb3duJywgICAgIC8vIG51bXBhZCAyXHJcbiAgICAxMDA6ICdsZWZ0JywgICAgLy8gbnVtcGFkIDRcclxuICAgIDEwMjogJ3JpZ2h0JywgICAvLyBudW1wYWQgNlxyXG4gICAgMTA0OiAndXAnLCAgICAgIC8vIG51bXBhZCA4XHJcbiAgICAxMjA6ICdkZWJ1ZycgICAgLy8gRjlcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHM9aG90X0lucHV0XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9ob3RfSW5wdXQuanMiLCJsZXQgaG90X1NjZW5lX0Jvb3Q9KCk9PntcclxuICBjb25zb2xlLmxvZygn5LiA6Iis5Zy65pmv5Y+q5Lya5Zyo5Yid5aeL5YyW55Sf5pWIJylcclxuICBTY2VuZV9Cb290LnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIFNjZW5lX0Jhc2UucHJvdG90eXBlLnN0YXJ0LmNhbGwodGhpcyk7XHJcbiAgICBTb3VuZE1hbmFnZXIucHJlbG9hZEltcG9ydGFudFNvdW5kcygpO1xyXG4gICAgaWYgKERhdGFNYW5hZ2VyLmlzQmF0dGxlVGVzdCgpKSB7XHJcbiAgICAgIERhdGFNYW5hZ2VyLnNldHVwQmF0dGxlVGVzdCgpO1xyXG4gICAgICBTY2VuZU1hbmFnZXIuZ290byhTY2VuZV9CYXR0bGUpO1xyXG4gICAgfSBlbHNlIGlmIChEYXRhTWFuYWdlci5pc0V2ZW50VGVzdCgpKSB7XHJcbiAgICAgIERhdGFNYW5hZ2VyLnNldHVwRXZlbnRUZXN0KCk7XHJcbiAgICAgIFNjZW5lTWFuYWdlci5nb3RvKFNjZW5lX01hcCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNoZWNrUGxheWVyTG9jYXRpb24oKTtcclxuICAgICAgRGF0YU1hbmFnZXIuc2V0dXBOZXdHYW1lKCk7XHJcbiAgICAgIC8vU2NlbmVNYW5hZ2VyLmdvdG8oU2NlbmVfVGFua1dhclRpdGxlKVxyXG4gICAgICAvL1NjZW5lTWFuYWdlci5nb3RvKFNjZW5lX1RpdGxlKTtcclxuICAgICAgU2NlbmVNYW5hZ2VyLmdvdG8oU2NlbmVfTWFwKTtcclxuICAgICAgV2luZG93X1RpdGxlQ29tbWFuZC5pbml0Q29tbWFuZFBvc2l0aW9uKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZURvY3VtZW50VGl0bGUoKTtcclxuICB9XHJcbiAgLy/lvLrooYzlm57lvIDlpLRcclxuICAvL+eDreWKoOi9veWbnuWOu1xyXG4gIC8vU2NlbmVNYW5hZ2VyLmdvdG8oU2NlbmVfVGl0bGUpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzPWhvdF9TY2VuZV9Cb290XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9ob3RfU2NlbmVfQm9vdC5qcyIsImxldCBob3RfU2NlbmVfTWFwPSgpPT57XHJcbiAgbGV0IFNjZW5lX01hcF9wcm90b3R5cGVfdXBkYXRlPVNjZW5lX01hcC5wcm90b3R5cGUudXBkYXRlXHJcbiAgbGV0IFNjZW5lX01hcF9jcmVhdGVBbGxXaW5kb3dzPVNjZW5lX01hcC5wcm90b3R5cGUuY3JlYXRlQWxsV2luZG93c1xyXG4gIE9iamVjdC5hc3NpZ24oU2NlbmVfTWFwLnByb3RvdHlwZSx7XHJcbiAgICBkaXNGcm9tQ2hhcmFjdGVyKGNoYXJhY3Rlcl8xLGNoYXJhY3Rlcl8yKXtcclxuICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMuZGVsdGFYKGNoYXJhY3Rlcl8xLl9yZWFsWCwgY2hhcmFjdGVyXzIuX3JlYWxYKSkgKyBNYXRoLmFicyh0aGlzLmRlbHRhWShjaGFyYWN0ZXJfMS5fcmVhbFksIGNoYXJhY3Rlcl8yLl9yZWFsWSkpXHJcbiAgICAgIC8v5a6e6ZmF5LiK5rKh5pyJdGhpcyzlm6DkuLpTY2VuZV9NYXDkuI3mmK8kZ2FtZU1hcFxyXG4gICAgfSxcclxuICAgIGNyZWF0ZUFsbFdpbmRvd3MoKXtcclxuICAgICAgU2NlbmVfTWFwX2NyZWF0ZUFsbFdpbmRvd3MuY2FsbCh0aGlzKVxyXG4gICAgICBjb25zb2xlLmxvZygn5Yqg6L29V2luYmFyJylcclxuICAgICAgdGhpcy5hZGRXaW5kb3cobmV3IFdpbmRvd19CYXIoJGdhbWVQbGF5ZXIpKVxyXG4gICAgICBmb3IobGV0IF9lIG9mICRnYW1lTWFwLmV2ZW50cygpKXtcclxuICAgICAgICB0aGlzLmFkZFdpbmRvdyhuZXcgV2luZG93X0JhcihfZSkpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgLy9TY2VuZV9NYXBfcHJvdG90eXBlX3VwZGF0ZS5jYWxsKHRoaXMpXHJcbiAgICAgIC8v5ZON5bqU5oyJ6ZKu6Lez6LeDICDpl67popjmmK/ov5jmsqHmiorop4bop5Lnp7vliqjvvIzlubbkuJTovrnnlYzliKTlrppcclxuICAgICAgLy9jb25zb2xlLmxvZygxKVxyXG4gICAgICBpZihJbnB1dC5pc1ByZXNzZWQoJ3NwYWNlJykpe1xyXG4gICAgICAgICRnYW1lUGxheWVyLmp1bXBTdHJhaWdodCgpXHJcblxyXG5cclxuICAgICAgICAvL+WTjeW6lOaMiemSruWIoOaOieaJgOacieS6i+S7tlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJGdhbWVNYXAuX2V2ZW50cylcclxuICAgICAgICAvKlxyXG4gICAgICAgIGZvcihsZXQgX2Ugb2YgJGdhbWVNYXAuX2V2ZW50cyl7XHJcbiAgICAgICAgICBpZighIV9lKXtcclxuICAgICAgICAgICAgX2UuZXJhc2UoKS8v5piv6Ieq5bex5Ye95pWw5ZCN5YaZ6ZSZ5LqGLGVyYXNl5rKh5pyJ5LiL5YiS57q/XHJcbiAgICAgICAgICAgIC8vX2UuX2VyYXNlZCA9IHRydWUvL+aciemXrumimO+8jOagueacrOi/meexu+eahOWxnuaAp+mDveayoeacieS6hlxyXG4gICAgICAgICAgICAvL19lLnJlZnJlc2goKS8v55Sx5LqO5LqL5Lu25YiX6KGo55qE56ys5LiA5Liq5piv56m65Ye95pWw77yM5omA5Lul5LiN6KGMIC8v55u05o6lIF9lcmFzZeeahOaWueazleS4jeingeS6hu+8jOWPquiDveeUqOasoeS4gOe6p+eahOaWueazlVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuXHJcbiAgICAgICAgLy8kZ2FtZU1hcC5fZXZlbnRzWzJdLmNsZWFyUGFnZVNldHRpbmdzKClcclxuICAgICAgICAvL+WOi+agueS4jeeUn+aViO+8jOWPr+iDveWSjOWcuuaZr+iHquW3seeahHVwZGF0ZeWGsueqgeaIluiAheWcqHRoaXPnmoTojrflvpfmnInpl67popjvvIzlm6DkuLrmgLvmmK91bmRlZmluZWRcclxuICAgICAgICAvLyRnYW1lTWFwLl9ldmVudHMuc3BsaWNlKDIsMSlcclxuICAgICAgICAvLyRnYW1lTWFwLl9ldmVudHNbMl0uZXJhc2UoKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJGdhbWVNYXApXHJcbiAgICAgICAgLypcclxuICAgICAgICBmb3IobGV0IF9lIG9mICRnYW1lTWFwLl9ldmVudHMpe1xyXG4gICAgICAgICAgaWYodHlwZW9mKF9lLl9lcmFzZSk9PVwidW5kZWZpbmVkXCIpe1xyXG4gICAgICAgICAgICBfZS5fZXJhc2UoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTw9JGdhbWVNYXAuX2V2ZW50cy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgICAkZ2FtZU1hcC5fZXZlbnRzW2ldLl9lcmFzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcbiAgICAgIH1cclxuICAgICAgaWYoSW5wdXQuaXNQcmVzc2VkKCdzaGlmdCcpKXtcclxuICAgICAgICBpZighJGdhbWVQbGF5ZXIuaXNNb3ZpbmcoKSl7XHJcbiAgICAgICAgICAvLyRnYW1lUGxheWVyLm1vdmVUb3dhcmRDaGFyYWN0ZXIoKVxyXG4gICAgICAgICAgJGdhbWVQbGF5ZXIuc2V0TW92ZVNwZWVkKDYpXHJcbiAgICAgICAgICAkZ2FtZVBsYXllci5tb3ZlU3RyYWlnaHQoJGdhbWVQbGF5ZXIuX2RpcmVjdGlvbilcclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICBzd2l0Y2goJGdhbWVQbGF5ZXIuX2RpcmVjdGlvbil7XHJcbiAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAkZ2FtZVBsYXllci5qdW1wKDAsLTIpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICRnYW1lUGxheWVyLmp1bXAoMCwyKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAkZ2FtZVBsYXllci5qdW1wKC0yLDApXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICRnYW1lUGxheWVyLmp1bXAoMiwwKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/lk43lupTmjInpkq7liKDmjonmiYDmnInkuovku7ZcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRnYW1lTWFwLl9ldmVudHMpXHJcbiAgICAgICAgLypcclxuICAgICAgICBmb3IobGV0IF9lIG9mICRnYW1lTWFwLl9ldmVudHMpe1xyXG4gICAgICAgICAgaWYoISFfZSl7XHJcbiAgICAgICAgICAgIF9lLmVyYXNlKCkvL+aYr+iHquW3seWHveaVsOWQjeWGmemUmeS6hixlcmFzZeayoeacieS4i+WIkue6v1xyXG4gICAgICAgICAgICAvL19lLl9lcmFzZWQgPSB0cnVlLy/mnInpl67popjvvIzmoLnmnKzov5nnsbvnmoTlsZ7mgKfpg73msqHmnInkuoZcclxuICAgICAgICAgICAgLy9fZS5yZWZyZXNoKCkvL+eUseS6juS6i+S7tuWIl+ihqOeahOesrOS4gOS4quaYr+epuuWHveaVsO+8jOaJgOS7peS4jeihjCAvL+ebtOaOpSBfZXJhc2XnmoTmlrnms5XkuI3op4HkuobvvIzlj6rog73nlKjmrKHkuIDnuqfnmoTmlrnms5VcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuXHJcblxyXG4gICAgICAgIC8vJGdhbWVNYXAuX2V2ZW50c1syXS5jbGVhclBhZ2VTZXR0aW5ncygpXHJcbiAgICAgICAgLy/ljovmoLnkuI3nlJ/mlYjvvIzlj6/og73lkozlnLrmma/oh6rlt7HnmoR1cGRhdGXlhrLnqoHmiJbogIXlnKh0aGlz55qE6I635b6X5pyJ6Zeu6aKY77yM5Zug5Li65oC75pivdW5kZWZpbmVkXHJcbiAgICAgICAgLy8kZ2FtZU1hcC5fZXZlbnRzLnNwbGljZSgyLDEpXHJcbiAgICAgICAgLy8kZ2FtZU1hcC5fZXZlbnRzWzJdLmVyYXNlKClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRnYW1lTWFwKVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgZm9yKGxldCBfZSBvZiAkZ2FtZU1hcC5fZXZlbnRzKXtcclxuICAgICAgICAgIGlmKHR5cGVvZihfZS5fZXJhc2UpPT1cInVuZGVmaW5lZFwiKXtcclxuICAgICAgICAgICAgX2UuX2VyYXNlKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuICAgICAgICAvKlxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8PSRnYW1lTWFwLl9ldmVudHMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhpKVxyXG4gICAgICAgICAgJGdhbWVNYXAuX2V2ZW50c1tpXS5fZXJhc2UoKVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG4gICAgICB9XHJcbiAgICAgIGlmKElucHV0LmlzUHJlc3NlZCgnY29udHJvbCcpKXtcclxuICAgICAgICBTY2VuZU1hbmFnZXIuX3NjZW5lLl9zcHJpdGVzZXQuX3RpbGVtYXAuY2hpbGRyZW4uc3BsaWNlKDgsMSlcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCRnYW1lTWFwLmRpc0Zyb21DaGFyYWN0ZXIoJGdhbWVQbGF5ZXIsJGdhbWVNYXAuZXZlbnRzKClbMF0pKVxyXG4gICAgICAgIGlmKCEkZ2FtZVBsYXllci5pc01vdmluZygpKXtcclxuICAgICAgICAgIC8vJGdhbWVQbGF5ZXIubW92ZVRvd2FyZENoYXJhY3RlcigpXHJcbiAgICAgICAgICAvLyRnYW1lUGxheWVyLnR1cm5Ub3dhcmRDaGFyYWN0ZXIoKVxyXG4gICAgICAgICAgLy8kZ2FtZU1hcC5fZXZlbnRbMV1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKElucHV0LmlzUHJlc3NlZCgnZicpKXtcclxuICAgICAgICBjb25zb2xlLmxvZygxKVxyXG4gICAgICAgIGxldCBhbmltYXRpb249JGRhdGFBbmltYXRpb25zWzNdXHJcbiAgICAgICAgdmFyIG5hbWUxID0gYW5pbWF0aW9uLmFuaW1hdGlvbjFOYW1lXHJcbiAgICAgICAgdmFyIG5hbWUyID0gYW5pbWF0aW9uLmFuaW1hdGlvbjJOYW1lXHJcbiAgICAgICAgdmFyIGh1ZTEgPSBhbmltYXRpb24uYW5pbWF0aW9uMUh1ZVxyXG4gICAgICAgIHZhciBodWUyID0gYW5pbWF0aW9uLmFuaW1hdGlvbjJIdWVcclxuICAgICAgICBJbWFnZU1hbmFnZXIucmVxdWVzdEFuaW1hdGlvbihuYW1lMSwgaHVlMSlcclxuICAgICAgICBJbWFnZU1hbmFnZXIucmVxdWVzdEFuaW1hdGlvbihuYW1lMiwgaHVlMilcclxuXHJcbiAgICAgIH1cclxuICAgICAgaWYoSW5wdXQuaXNQcmVzc2VkKCdoJykpe1xyXG5cclxuICAgICAgICAkZ2FtZVBsYXllci5za2lsbENoYXJhY3RlcigpXHJcblxyXG4gICAgICB9XHJcbiAgICAgIFNjZW5lX01hcF9wcm90b3R5cGVfdXBkYXRlLmNhbGwodGhpcylcclxuXHJcbiAgICB9LFxyXG4gIH0pXHJcbn1cclxubW9kdWxlLmV4cG9ydHM9aG90X1NjZW5lX01hcFxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaG90X1NjZW5lX01hcC5qcyIsImxldCBob3RfU2NlbmVfVGl0bGVfbmV3PSgpPT57XHJcbiAgY2xhc3MgU2NlbmVfVGl0bGVfbmV3IGV4dGVuZHMgU2NlbmVfQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKXtcclxuICAgICAgc3VwZXIoLi4uYXJncylcclxuICAgIH1cclxuICAgIGNyZWF0ZSgpe1xyXG4gICAgICBzdXBlci5jcmVhdGUoKVxyXG4gICAgICB0aGlzLmNyZWF0ZUJhY2tncm91bmQoKVxyXG4gICAgICB0aGlzLmNyZWF0ZUZvcmVncm91bmQoKVxyXG4gICAgICB0aGlzLmNyZWF0ZVdpbmRvd0xheWVyKClcclxuICAgICAgdGhpcy5jcmVhdGVDb21tYW5kV2luZG93KClcclxuICAgIH1cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgIHN1cGVyLnN0YXJ0KClcclxuICAgICAgU2NlbmVNYW5hZ2VyLmNsZWFyU3RhY2soKVxyXG4gICAgICB0aGlzLmNlbnRlclNwcml0ZSh0aGlzLl9iYWNrU3ByaXRlMSlcclxuICAgICAgdGhpcy5jZW50ZXJTcHJpdGUodGhpcy5fYmFja1Nwcml0ZTIpXHJcbiAgICAgIHRoaXMucGxheVRpdGxlTXVzaWMoKVxyXG4gICAgICB0aGlzLnN0YXJ0RmFkZUluKHRoaXMuZmFkZVNwZWVkKCksZmFsc2UpXHJcbiAgICB9XHJcbiAgICB1cGRhdGUoKXtcclxuICAgICAgaWYgKCF0aGlzLmlzQnVzeSgpKSB7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZFdpbmRvdy5vcGVuKCk7XHJcbiAgICAgIH1cclxuICAgICAgc3VwZXIudXBkYXRlKClcclxuICAgIH1cclxuICAgIGlzQnVzeSgpe1xyXG4gICAgICByZXR1cm4gdGhpcy5fY29tbWFuZFdpbmRvdy5pc0Nsb3NpbmcoKSB8fCBzdXBlci5pc0J1c3koKVxyXG4gICAgfVxyXG4gICAgdGVybWluYXRlKCl7XHJcbiAgICAgIHN1cGVyLnRlcm1pbmF0ZSgpXHJcbiAgICAgIFNjZW5lTWFuYWdlci5zbmFwRm9yQmFja2dyb3VuZCgpXHJcbiAgICB9XHJcbiAgICBjcmVhdGVCYWNrZ3JvdW5kKCl7XHJcbiAgICAgIHRoaXMuX2JhY2tTcHJpdGUxID0gbmV3IFNwcml0ZShJbWFnZU1hbmFnZXIubG9hZFRpdGxlMSgkZGF0YVN5c3RlbS50aXRsZTFOYW1lKSk7XHJcbiAgICAgIHRoaXMuX2JhY2tTcHJpdGUyID0gbmV3IFNwcml0ZShJbWFnZU1hbmFnZXIubG9hZFRpdGxlMigkZGF0YVN5c3RlbS50aXRsZTJOYW1lKSk7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5fYmFja1Nwcml0ZTEpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX2JhY2tTcHJpdGUyKTtcclxuICAgIH1cclxuICAgIGNyZWF0ZUZvcmVncm91bmQoKXtcclxuICAgICAgdGhpcy5fZ2FtZVRpdGxlU3ByaXRlID0gbmV3IFNwcml0ZShuZXcgQml0bWFwKEdyYXBoaWNzLndpZHRoLCBHcmFwaGljcy5oZWlnaHQpKTtcclxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLl9nYW1lVGl0bGVTcHJpdGUpO1xyXG4gICAgICBpZiAoJGRhdGFTeXN0ZW0ub3B0RHJhd1RpdGxlKSB7XHJcbiAgICAgICAgdGhpcy5kcmF3R2FtZVRpdGxlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgd2luZG93LlNjZW5lX1RpdGxlX25ldz1TY2VuZV9UaXRsZV9uZXdcclxufVxyXG5tb2R1bGUuZXhwb3J0cz1ob3RfU2NlbmVfVGl0bGVfbmV3XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9ob3RfU2NlbmVfVGl0bGVfbmV3LmpzIiwibGV0IGhvdF9TcHJpdGVfQ2hhcmFjdGVyPSgpPT57XHJcbiAgbGV0IFNwcml0ZV9DaGFyYWN0ZXJfcHJvdG90eXBlX2luaXRpYWxpemU9U3ByaXRlX0NoYXJhY3Rlci5wcm90b3R5cGUuaW5pdGlhbGl6ZVxyXG4gIE9iamVjdC5hc3NpZ24oU3ByaXRlX0NoYXJhY3Rlci5wcm90b3R5cGUse1xyXG4gICAgdGlsZW1hcF9pbmRleCgpe1xyXG4gICAgICB0aGlzLl90aWxlbWFwX2luZGV4PVNjZW5lTWFuYWdlci5fc2NlbmUuX3Nwcml0ZXNldC5fdGlsZW1hcC5jaGlsZHJlbi5maW5kSW5kZXgoKG4pPT57XHJcbiAgICAgICAgcmV0dXJuIG49PT10aGlzXHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0aGlzLl90aWxlbWFwX2luZGV4XHJcbiAgICB9LFxyXG4gICAgdGlsZW1hcF9yZWJvcm4oKXtcclxuICAgICAgU2NlbmVNYW5hZ2VyLl9zY2VuZS5fc3ByaXRlc2V0Ll90aWxlbWFwLmNoaWxkcmVuLnNwbGljZSh0aGlzLl90aWxlbWFwX2luZGV4LDAsdGhpcylcclxuICAgIH0sXHJcbiAgICB0aWxlbWFwX2Zha2UoKXtcclxuICAgICAgU2NlbmVNYW5hZ2VyLl9zY2VuZS5fc3ByaXRlc2V0Ll90aWxlbWFwLmNoaWxkcmVuLnNwbGljZSh0aGlzLl90aWxlbWFwX2luZGV4LDAsbmV3IFNwcml0ZV9DaGFyYWN0ZXIoJGdhbWVQbGF5ZXIpKVxyXG4gICAgfSwvL25ldyBTcHJpdGVfQ2hhcmFjdGVyKCRnYW1lUGxheWVyKT09PSRnYW1lUGxheWVyLl9zcHJpdGVfY2hhcmFjdGVyIC8vdHJ1ZSAvL+S9huaYr+i/kOihjOS8muWHuumUmVxyXG4gICAgdGlsZW1hcF9kZWxldGUoKXtcclxuICAgICAgU2NlbmVNYW5hZ2VyLl9zY2VuZS5fc3ByaXRlc2V0Ll90aWxlbWFwLmNoaWxkcmVuLnNwbGljZSh0aGlzLnRpbGVtYXBfaW5kZXgoKSwxKVxyXG4gICAgfSxcclxuICAgIHRpbGVtYXBfZmFrZV9hZGQoKXtcclxuICAgICAgU2NlbmVNYW5hZ2VyLl9zY2VuZS5fc3ByaXRlc2V0Ll90aWxlbWFwLmFkZENoaWxkKG5ldyBTcHJpdGVfQ2hhcmFjdGVyKCRnYW1lUGxheWVyKSlcclxuICAgICAgLy/nlKjkuoZhZGRDaGlsZCDku6Pmm7/nm7TmjqXmk43kvZzmlbDnu4TvvIzlsLHpgb/lhY3kuobpl67pophcclxuICAgIH0sXHJcbiAgICB0aWxlbWFwX2FkZCgpe1xyXG4gICAgICBTY2VuZU1hbmFnZXIuX3NjZW5lLl9zcHJpdGVzZXQuX3RpbGVtYXAuYWRkQ2hpbGQodGhpcylcclxuICAgIH0sXHJcbiAgICB0aWxlbWFwX3JlbW92ZSgpe1xyXG4gICAgICBTY2VuZU1hbmFnZXIuX3NjZW5lLl9zcHJpdGVzZXQuX3RpbGVtYXAucmVtb3ZlQ2hpbGQodGhpcylcclxuICAgIH0sXHJcbiAgICBpbml0aWFsaXplKGNoYXJhY3Rlcil7XHJcbiAgICAgIFNwcml0ZV9DaGFyYWN0ZXJfcHJvdG90eXBlX2luaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG4gICAgICBjaGFyYWN0ZXIuX3Nwcml0ZV9jaGFyYWN0ZXI9dGhpc1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxubW9kdWxlLmV4cG9ydHM9aG90X1Nwcml0ZV9DaGFyYWN0ZXJcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hvdF9TcHJpdGVfQ2hhcmFjdGVyLmpzIiwibGV0IGhvdF9XaW5kb3dfQmFyPSgpPT57XHJcbiAgY2xhc3MgV2luZG93X0JhciBleHRlbmRzIFdpbmRvd19CYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNoYXJhY3Rlcil7XHJcbiAgICAgIC8v5Y6f5p2l55qE5p6E6YCg5Ye95pWw5bCx5piv5Y6f5p2l55qEaW5pdFxyXG4gICAgICBzdXBlcihjaGFyYWN0ZXIuc2NyZWVuWCgpLWNoYXJhY3Rlci5fc3ByaXRlX2NoYXJhY3Rlci5fcmVhbEZyYW1lLndpZHRoLzIsY2hhcmFjdGVyLnNjcmVlblkoKS1jaGFyYWN0ZXIuX3Nwcml0ZV9jaGFyYWN0ZXIuX3JlYWxGcmFtZS5oZWlnaHQqMS41LDQ4MCw0ODApXHJcbiAgICAgIHRoaXMuX2NoYXJhY3Rlcj1jaGFyYWN0ZXJcclxuICAgICAgY2hhcmFjdGVyLl93aW5kb3dfYmFyPXRoaXNcclxuICAgICAgY29uc29sZS5sb2codGhpcylcclxuICAgICAgLy90aGlzLmluaXRpYWxpemUuYXBwXHJcbiAgICAgIC8v6ZuG5oiQ55qE57G75Ly85LmO5LiN55SoaW5pdOS5n+iDveeUqO+8n++8n++8n++8n++8jOi/meagt+S+neeEtuS8muiwg+eUqOS/ruaUueWQjueahGluaXTkuIDmrKHvvIzku45jb25zb2xlLmxvZ+WPr+S7peeci+WHuu+8jOWPr+iDveWTqumHjOS4jeWvuVxyXG4gICAgICAvL+WOn+adpeeahOWGmeazleS8muaJp+ihjGluaXQy5qyhXHJcbiAgICAgIC8vdGhpcy5pbml0aWFsaXplKC4uLmFyZ3MpXHJcbiAgICB9XHJcbiAgICAvKlxyXG4gICAgaW5pdGlhbGl6ZShjaGFyYWN0ZXIpe1xyXG4gICAgICAvL3N1cGVyLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG4gICAgICBzdXBlci5pbml0aWFsaXplLmNhbGwodGhpcyxjaGFyYWN0ZXIuX3JlYWxYLGNoYXJhY3Rlci5fcmVhbFksNDgwLDQ4MClcclxuICAgICAgdGhpcy5fY2hhcmFjdGVyPWNoYXJhY3RlclxyXG4gICAgICBjaGFyYWN0ZXIuX3dpbmRvd19iYXI9dGhpc1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzKVxyXG5cclxuICAgIH1cclxuICAgICovXHJcbiAgICB3aW5kb3dMYXllcl9hZGQoKXtcclxuICAgICAgU2NlbmVNYW5hZ2VyLl9zY2VuZS5hZGRXaW5kb3codGhpcykvL+etieWQjFxyXG4gICAgICAvL1NjZW5lTWFuYWdlci5fc2NlbmUuX3dpbmRvd0xheWVyLnJlbW92ZUNoaWxkKHRoaXMpLy/nu5Pmnpzov5nkuKrkuI3ooYxcclxuICAgIH1cclxuICAgIHdpbmRvd0xheWVyX3JlbW92ZSgpe1xyXG4gICAgICBTY2VuZU1hbmFnZXIuX3NjZW5lLl93aW5kb3dMYXllci5yZW1vdmVDaGlsZCh0aGlzKVxyXG5cclxuICAgIH1cclxuICAgIHNob3coKXtcclxuICAgICAgdGhpcy53aW5kb3dza2luID0gSW1hZ2VNYW5hZ2VyLmxvYWRTeXN0ZW0oJycpXHJcbiAgICAgIHRoaXMuY29udGVudHMuZm9udFNpemU9MTJcclxuICAgICAgdGhpcy5jb250ZW50cy5vdXRsaW5lV2lkdGg9MFxyXG4gICAgICB0aGlzLmNvbnRlbnRzLnRleHRDb2xvcj0ncmVkJ1xyXG4gICAgICB0aGlzLmNvbnRlbnRzLmZvbnRGYWNlPSdBcmlhbCdcclxuICAgICAgLy90aGlzLmNvbnRlbnRzLmZvbnRGYWNlPSdDb25zb2xhcydcclxuICAgICAgbGV0IGhwPXRoaXMuX2NoYXJhY3Rlci5faHA/dGhpcy5fY2hhcmFjdGVyLl9ocDp0aGlzLl9jaGFyYWN0ZXIuX3Nwcml0ZV9jaGFyYWN0ZXIuX3JlYWxGcmFtZS53aWR0aFxyXG4gICAgICBsZXQgbWF4X2hwPXRoaXMuX2NoYXJhY3Rlci5fbWF4X2hwP3RoaXMuX2NoYXJhY3Rlci5fbWF4X2hwOnRoaXMuX2NoYXJhY3Rlci5fc3ByaXRlX2NoYXJhY3Rlci5fcmVhbEZyYW1lLndpZHRoXHJcbiAgICAgIHRoaXMuZHJhd1RleHQoJ+KWhycucmVwZWF0KGhwKSsn4paRJy5yZXBlYXQobWF4X2hwLWhwKSwwLDAsNDgsJ2xlZnQnKVxyXG5cclxuICAgIH1cclxuICAgIHVwZGF0ZSgpe1xyXG4gICAgICB0aGlzLl9pc1dpbmRvdz1mYWxzZVxyXG4gICAgICB0aGlzLl9tYXJnaW49MFxyXG4gICAgICB0aGlzLl9wYWRkaW5nPTBcclxuICAgICAgdGhpcy5jb250ZW50cy5jbGVhcigpXHJcbiAgICAgIC8vdGhpcy5tb3ZlKCRnYW1lUGxheWVyLnNjcmVlblgoKS13aWR0aC8yLCRnYW1lUGxheWVyLnNjcmVlblkoKS1oZWlnaHQvMi01MCw1MDAsNTAwKVxyXG4gICAgICB0aGlzLm1vdmUodGhpcy5fY2hhcmFjdGVyLnNjcmVlblgoKS10aGlzLl9jaGFyYWN0ZXIuX3Nwcml0ZV9jaGFyYWN0ZXIuX3JlYWxGcmFtZS53aWR0aC8yLHRoaXMuX2NoYXJhY3Rlci5zY3JlZW5ZKCktdGhpcy5fY2hhcmFjdGVyLl9zcHJpdGVfY2hhcmFjdGVyLl9yZWFsRnJhbWUuaGVpZ2h0KjEuNSw0ODAsNDgwKVxyXG4gICAgICB0aGlzLnNob3coKVxyXG4gICAgfVxyXG4gIH1cclxuICB3aW5kb3cuV2luZG93X0Jhcj1XaW5kb3dfQmFyXHJcbn1cclxubW9kdWxlLmV4cG9ydHM9aG90X1dpbmRvd19CYXJcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2hvdF9XaW5kb3dfQmFyLmpzIiwibGV0IGhvdF9JbnB1dD1yZXF1aXJlKCcuL2hvdF9JbnB1dCcpXHJcbmhvdF9JbnB1dCgpXHJcbmxldCBob3RfR2FtZV9DaGFyYWN0ZXI9cmVxdWlyZSgnLi9ob3RfR2FtZV9DaGFyYWN0ZXInKVxyXG5ob3RfR2FtZV9DaGFyYWN0ZXIoKVxyXG5sZXQgaG90X0dhbWVfUGxheWVyPXJlcXVpcmUoJy4vaG90X0dhbWVfUGxheWVyJylcclxuaG90X0dhbWVfUGxheWVyKClcclxubGV0IGhvdF9HYW1lX0V2ZW50PXJlcXVpcmUoJy4vaG90X0dhbWVfRXZlbnQnKVxyXG5ob3RfR2FtZV9FdmVudCgpXHJcbmxldCBob3RfR2FtZV9NYXA9cmVxdWlyZSgnLi9ob3RfR2FtZV9NYXAnKVxyXG5ob3RfR2FtZV9NYXAoKVxyXG5sZXQgaG90X0dhbWVfSW50ZXJwcmV0ZXI9cmVxdWlyZSgnLi9ob3RfR2FtZV9JbnRlcnByZXRlci5qcycpXHJcbmhvdF9HYW1lX0ludGVycHJldGVyKClcclxubGV0IGhvdF9XaW5kb3dfQmFyPXJlcXVpcmUoJy4vaG90X1dpbmRvd19CYXInKVxyXG5ob3RfV2luZG93X0JhcigpXHJcbmxldCBob3RfU2NlbmVfVGl0bGVfbmV3PXJlcXVpcmUoJy4vaG90X1NjZW5lX1RpdGxlX25ldycpXHJcbmhvdF9TY2VuZV9UaXRsZV9uZXcoKVxyXG5sZXQgaG90X1NjZW5lX0Jvb3Q9cmVxdWlyZSgnLi9ob3RfU2NlbmVfQm9vdCcpXHJcbmhvdF9TY2VuZV9Cb290KClcclxubGV0IGhvdF9TcHJpdGVfQ2hhcmFjdGVyPXJlcXVpcmUoJy4vaG90X1Nwcml0ZV9DaGFyYWN0ZXInKVxyXG5ob3RfU3ByaXRlX0NoYXJhY3RlcigpXHJcbmxldCBob3RfU2NlbmVfTWFwPXJlcXVpcmUoJy4vaG90X1NjZW5lX01hcCcpXHJcbmhvdF9TY2VuZV9NYXAoKVxyXG5cclxuaWYobW9kdWxlLmhvdCl7XHJcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vaG90X0dhbWVfRXZlbnQuanMnLGZ1bmN0aW9uICgpIHtcclxuICAgIGhvdF9HYW1lX0V2ZW50PXJlcXVpcmUoJy4vaG90X0dhbWVfRXZlbnQuanMnKVxyXG4gICAgaG90X0dhbWVfRXZlbnQoKVxyXG4gIH0pXHJcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vaG90X0dhbWVfSW50ZXJwcmV0ZXIuanMnLGZ1bmN0aW9uICgpIHtcclxuICAgIGhvdF9HYW1lX0ludGVycHJldGVyPXJlcXVpcmUoJy4vaG90X0dhbWVfSW50ZXJwcmV0ZXIuanMnKVxyXG4gICAgaG90X0dhbWVfSW50ZXJwcmV0ZXIoKVxyXG4gIH0pXHJcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vaG90X1NjZW5lX0Jvb3QuanMnLGZ1bmN0aW9uICgpIHtcclxuICAgIGhvdF9TY2VuZV9Cb290PXJlcXVpcmUoJy4vaG90X1NjZW5lX0Jvb3QuanMnKVxyXG4gICAgaG90X1NjZW5lX0Jvb3QoKVxyXG4gIH0pXHJcbiAgbW9kdWxlLmhvdC5hY2NlcHQoJy4vaG90X1NjZW5lX01hcC5qcycsZnVuY3Rpb24gKCkge1xyXG4gICAgaG90X1NjZW5lX01hcD1yZXF1aXJlKCcuL2hvdF9TY2VuZV9NYXAuanMnKVxyXG4gICAgaG90X1NjZW5lX01hcCgpXHJcbiAgfSlcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9
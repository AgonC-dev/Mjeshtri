var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a, _b;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React3, { Component, useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential, RecaptchaVerifier, multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, verifyPasswordResetCode, checkActionCode, confirmPasswordReset, applyActionCode } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, limit, getDocs, orderBy, serverTimestamp, writeBatch, increment, updateDoc, setDoc, arrayUnion, addDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { createPortal } from "react-dom";
import PhoneInput from "react-phone-input-2";
import imageCompression from "browser-image-compression";
import { Link, NavLink, Outlet, useNavigate, useParams, useLocation, useSearchParams, Routes, Route } from "react-router-dom";
import { CheckCircle2, Heart, User, Home as Home$1, Search as Search$2, Flame, LayoutDashboard, Power } from "lucide-react";
import { style } from "framer-motion/client";
import { useMotionValue, useTransform, motion } from "framer-motion";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = {
        ...approvedSeenTags[attributeKey],
        ...instanceSeenTags[attributeKey]
      };
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return {
    ...obj,
    [key]: void 0
  };
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title3, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title3);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title3, attributes) => {
  const initProps = {
    key: title3,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React3.createElement("title", props, title3)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React3.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title: title3 = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title: title3, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React3.createContext(defaultValue);
var HelmetProvider = (_a = class extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    this.helmetData = new HelmetData(this.props.context || {}, _a.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React3.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_a, "canUseDOM", isDocument), _a);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => {
    var _a2;
    return (_a2 = tag.parentNode) == null ? void 0 : _a2.removeChild(tag);
  });
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title3, attributes) => {
  if (typeof title3 !== "undefined" && document.title !== title3) {
    document.title = flattenArray(title3);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title: title3,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title3, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = { ...instance.props };
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = (_b = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return {
      ...arrayTypeChildren,
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        {
          ...newChildProps,
          ...this.mapNestedChildrenToProps(child, nestedChildren)
        }
      ]
    };
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return {
          ...newProps,
          [child.type]: nestedChildren,
          titleAttributes: { ...newChildProps }
        };
      case "body":
        return {
          ...newProps,
          bodyAttributes: { ...newChildProps }
        };
      case "html":
        return {
          ...newProps,
          htmlAttributes: { ...newChildProps }
        };
      default:
        return {
          ...newProps,
          [child.type]: { ...newChildProps }
        };
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = { ...newProps };
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = {
        ...newFlattenedProps,
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      };
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name2) => child.type === name2),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React3.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const { children: nestedChildren, ...childProps } = child.props;
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const { children, ...props } = this.props;
    let newProps = { ...props };
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React3.createElement(HelmetDispatcher, { ...newProps, context: helmetData.value }) : /* @__PURE__ */ React3.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React3.createElement(HelmetDispatcher, { ...newProps, context }));
  }
}, __publicField(_b, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _b);
const header$3 = "_header_13jw2_1";
const container$b = "_container_13jw2_17";
const nav = "_nav_13jw2_35";
const navLink = "_navLink_13jw2_47";
const active$5 = "_active_13jw2_65";
const navLinkLogIn = "_navLinkLogIn_13jw2_93";
const logActive = "_logActive_13jw2_129";
const searchIcon$2 = "_searchIcon_13jw2_137";
const right = "_right_13jw2_173";
const profileWrapper = "_profileWrapper_13jw2_193";
const profileCircle = "_profileCircle_13jw2_201";
const avatar = "_avatar_13jw2_223";
const logo = "_logo_13jw2_239";
const dropdown = "_dropdown_13jw2_271";
const dropdownHeader = "_dropdownHeader_13jw2_311";
const userName = "_userName_13jw2_319";
const userEmail = "_userEmail_13jw2_339";
const proBadgeMenu = "_proBadgeMenu_13jw2_351";
const strengthField = "_strengthField_13jw2_373";
const strengthLabelRow = "_strengthLabelRow_13jw2_387";
const progressBar$2 = "_progressBar_13jw2_405";
const progressFill$2 = "_progressFill_13jw2_419";
const visibilityField = "_visibilityField_13jw2_433";
const statusIndicator = "_statusIndicator_13jw2_441";
const dotGreen = "_dotGreen_13jw2_459";
const dotGrey = "_dotGrey_13jw2_461";
const divider$1 = "_divider_13jw2_465";
const dropdownItem$1 = "_dropdownItem_13jw2_477";
const icon$3 = "_icon_13jw2_513";
const upgradePrompt = "_upgradePrompt_13jw2_523";
const logoutButton = "_logoutButton_13jw2_561";
const strengthHint = "_strengthHint_13jw2_661";
const criticalWarning = "_criticalWarning_13jw2_677";
const warningHeader = "_warningHeader_13jw2_691";
const warningText = "_warningText_13jw2_705";
const fixLink = "_fixLink_13jw2_719";
const adminLink = "_adminLink_13jw2_783";
const favoritesTrigger = "_favoritesTrigger_13jw2_829";
const favBadge = "_favBadge_13jw2_865";
const favModalContainer = "_favModalContainer_13jw2_909";
const modalCloseBtn = "_modalCloseBtn_13jw2_933";
const favHeader = "_favHeader_13jw2_987";
const favItem = "_favItem_13jw2_1027";
const favAvatar = "_favAvatar_13jw2_1067";
const favMainInfo = "_favMainInfo_13jw2_1083";
const favTag = "_favTag_13jw2_1107";
const favLocation = "_favLocation_13jw2_1129";
const favActions = "_favActions_13jw2_1143";
const favCallBtn = "_favCallBtn_13jw2_1155";
const favViewBtn = "_favViewBtn_13jw2_1183";
const favRemoveBtn = "_favRemoveBtn_13jw2_1205";
const favFooter = "_favFooter_13jw2_1235";
const clearAllLink = "_clearAllLink_13jw2_1245";
const emptyState$1 = "_emptyState_13jw2_1263";
const confirmModal = "_confirmModal_13jw2_1273";
const confirmIcon = "_confirmIcon_13jw2_1289";
const confirmActions = "_confirmActions_13jw2_1301";
const confirmYes = "_confirmYes_13jw2_1313";
const confirmNo = "_confirmNo_13jw2_1313";
const emptyIllustration = "_emptyIllustration_13jw2_1385";
const mobileBottomNav = "_mobileBottomNav_13jw2_1389";
const mobileLoginIcon = "_mobileLoginIcon_13jw2_1397";
const loggedOutActions = "_loggedOutActions_13jw2_1405";
const hideOnMobile = "_hideOnMobile_13jw2_1503";
const mobileTab = "_mobileTab_13jw2_1605";
const activeTab$2 = "_activeTab_13jw2_1637";
const tabIcon = "_tabIcon_13jw2_1663";
const favList = "_favList_13jw2_1767";
const styles$C = {
  header: header$3,
  container: container$b,
  nav,
  navLink,
  active: active$5,
  navLinkLogIn,
  logActive,
  searchIcon: searchIcon$2,
  right,
  profileWrapper,
  profileCircle,
  avatar,
  logo,
  dropdown,
  dropdownHeader,
  userName,
  userEmail,
  proBadgeMenu,
  strengthField,
  strengthLabelRow,
  progressBar: progressBar$2,
  progressFill: progressFill$2,
  visibilityField,
  statusIndicator,
  dotGreen,
  dotGrey,
  divider: divider$1,
  dropdownItem: dropdownItem$1,
  icon: icon$3,
  upgradePrompt,
  logoutButton,
  strengthHint,
  criticalWarning,
  warningHeader,
  warningText,
  fixLink,
  adminLink,
  favoritesTrigger,
  favBadge,
  favModalContainer,
  modalCloseBtn,
  favHeader,
  favItem,
  favAvatar,
  favMainInfo,
  favTag,
  favLocation,
  favActions,
  favCallBtn,
  favViewBtn,
  favRemoveBtn,
  favFooter,
  clearAllLink,
  emptyState: emptyState$1,
  confirmModal,
  confirmIcon,
  confirmActions,
  confirmYes,
  confirmNo,
  emptyIllustration,
  mobileBottomNav,
  mobileLoginIcon,
  loggedOutActions,
  hideOnMobile,
  mobileTab,
  activeTab: activeTab$2,
  tabIcon,
  favList
};
const firebaseConfig = {
  apiKey: "AIzaSyD3fO_4lgJXnL7Ua3fZRdeFlIzDVbGW0MM",
  authDomain: "mjeshtri-48e95.firebaseapp.com",
  projectId: "mjeshtri-48e95",
  storageBucket: "mjeshtri-48e95.firebasestorage.app",
  messagingSenderId: "403322602804",
  appId: "1:403322602804:web:0a53e6bb693d7c52085161"
};
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LdPgLUsAAAAAIvDKJTsmtmupUnd0HXFcrk4047E"),
    isTokenAutoRefreshEnabled: true
  });
}
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions$2 = getFunctions(app, "us-central1");
const Logo$1 = "/assets/Logo2-GOoX1SOo.png";
const Search$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHFSURBVHgBrVQ7bsJAEN21AYkGXFLw2ZwA2nTQpQtHcE4AOUEoU5ITRJwgUKbCOUGcMlXMp0A0sRBFhATOGzSW/MHBAZ403pnd2efn2VkLcWHIpAWllLHdbptSyjrFnud96LpuO4D4DyER7Xa7LtwOzIiug9gC8V0SsYyQKZCNyfU3Y7Ch0oU1EDcDLzGn0+kgkZCVvTOZTSrn8/lbMLlUKqlsNtsBOX2BQE4LOVYwR/edQqHwiOEG5qxWq+vlcvkZfft6vXax9losFimk+pINfoCQQlb3Tf5ms7laLBaOOIJarTamEsDas9ls5M9r9KDTpJFqloaMc4d7RVK2g/MaT9Y5tkVKaJrm17cRI/RBpynOxJ4Q8iccq7QbUSbFe90YIRrV4rhtACIF8DW3PA5jhNT1WLDgGmifh2Nk6IomBpN8dMUoRshvusdA8rvlcrn3Fxla7IV8fG4/2hWhq1epVEwQP3NIiT1snmQyGQc1a+BkO3z9fDiYawXvtUxQQKRKHIaL9T6ITM4JkSb+vkgtEqnwBlQpKLeh0sb1e3IBute5XG58iPRkEGm1Wv2CebD9YeriDNDPIp/Pj9B2Lk57QLG4NH4BhBXmdC6xsG0AAAAASUVORK5CYII=";
const modal = "_modal_1lpkg_1";
const styles$B = {
  modal
};
function Modal({
  children,
  onCLose,
  open,
  className = ""
}) {
  const dialog = useRef(null);
  const [modalElement, setModalElement] = useState(null);
  useEffect(() => {
    setModalElement(document.getElementById("modal"));
  }, []);
  useEffect(() => {
    const modal2 = dialog.current;
    if (!modal2 || !modalElement) return;
    if (open && !modal2.open) {
      modal2.showModal();
    } else if (!open && modal2.open) {
      modal2.close();
    }
    return () => {
      if (modal2.open) {
        modal2.close();
      }
    };
  }, [open, modalElement]);
  if (!modalElement) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "dialog",
      {
        ref: dialog,
        className: `${styles$B.modal} ${className}`,
        children
      }
    ),
    modalElement
  );
}
const ADMIN_UID$1 = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";
function Header() {
  const menuRef = useRef();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [sure, setSure] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);
  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    setFavoritesList(saved);
    setFavCount(saved.length);
  };
  useEffect(() => {
    loadFavorites();
    const handleUpdate = () => loadFavorites();
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("favoritesUpdated", handleUpdate);
    };
  }, []);
  const removeFavorite = (id) => {
    const updated = favoritesList.filter((item) => item.id !== id);
    localStorage.setItem("mjeshtri_favs", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
    setFavoritesList(updated);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "workers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const calculateProfileStrength = () => {
    if (!userData) return 0;
    const essentials = ["fullName", "category", "city", "phoneNumber"];
    const hasEssentials = essentials.every(
      (field2) => userData[field2] !== void 0 && userData[field2] !== null && userData[field2].toString().trim() !== ""
    );
    if (!hasEssentials) return -1;
    let score2 = 30;
    if (userData.profilePic && !userData.profilePic.includes("avatars")) {
      score2 += 10;
    }
    if (userData.bio && userData.bio.trim().length > 20) {
      score2 += 10;
    }
    if (userData.experienceYears !== void 0 && userData.experienceYears !== null && userData.experienceYears !== "") {
      score2 += 10;
    }
    if (userData.startingPrice !== void 0 && userData.startingPrice !== null && userData.startingPrice !== "") {
      score2 += 10;
    }
    if (userData.portfolio && userData.portfolio.length > 0) {
      score2 += 10;
    }
    if (userData.isVerified) {
      score2 += 20;
    }
    return Math.min(score2, 100);
  };
  const getStrengthColor = (strength) => {
    if (strength === -1) return "#ef4444";
    if (strength < 70) return "#f97316";
    if (strength < 90) return "#eab308";
    return "#10b981";
  };
  const profileStrength = calculateProfileStrength();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: styles$C.header, children: /* @__PURE__ */ jsxs("div", { className: styles$C.container, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: styles$C.logo, children: /* @__PURE__ */ jsx("img", { src: Logo$1, alt: "Page Logo" }) }),
      /* @__PURE__ */ jsxs("nav", { className: styles$C.nav, children: [
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/",
            className: ({ isActive }) => isActive ? `${styles$C.navLink} ${styles$C.active}` : styles$C.navLink,
            children: "Kryefaqja"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/workers",
            className: ({ isActive }) => isActive ? `${styles$C.navLink} ${styles$C.active}` : styles$C.navLink,
            children: "Kërko Punëtorin"
          }
        ),
        /* @__PURE__ */ jsx(
          NavLink,
          {
            to: "/wanted",
            className: ({ isActive }) => isActive ? `${styles$C.navLink} ${styles$C.active}` : styles$C.navLink,
            children: "Më të kërkuarit"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$C.right, children: [
        user && user.uid === ADMIN_UID$1 && /* @__PURE__ */ jsxs(Link, { to: "/admin", className: styles$C.adminLink, children: [
          "⚙️ ",
          /* @__PURE__ */ jsx("span", { className: styles$C.hideOnMobile, children: "Paneli Admin" })
        ] }),
        user ? /* @__PURE__ */ jsxs("div", { className: styles$C.profileWrapper, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: styles$C.profileCircle,
              onClick: (e) => {
                e.stopPropagation();
                setShowDropDown(!showDropDown);
              },
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: (userData == null ? void 0 : userData.profilePic) || "https://via.placeholder.com/40",
                  alt: "Profile",
                  className: styles$C.avatar
                }
              )
            }
          ),
          showDropDown && /* @__PURE__ */ jsxs("div", { className: styles$C.dropdown, ref: menuRef, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$C.dropdownHeader, children: [
              /* @__PURE__ */ jsxs("div", { className: styles$C.headerTop, children: [
                /* @__PURE__ */ jsxs("p", { className: styles$C.userName, children: [
                  (userData == null ? void 0 : userData.fullName) || "Mjeshtër",
                  (userData == null ? void 0 : userData.isVerified) && /* @__PURE__ */ jsx(
                    CheckCircle2,
                    {
                      size: 20,
                      className: styles$C.verifiedBadge,
                      fill: "#0095f6",
                      color: "#fff"
                    }
                  )
                ] }),
                (userData == null ? void 0 : userData.isPro) && /* @__PURE__ */ jsx("span", { className: styles$C.proBadgeMenu, children: "PRO" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: styles$C.userEmail, children: user.email })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$C.strengthField, children: profileStrength === -1 ? /* @__PURE__ */ jsxs("div", { className: styles$C.criticalWarning, children: [
              /* @__PURE__ */ jsx("div", { className: styles$C.warningHeader, children: /* @__PURE__ */ jsx("span", { children: "⚠️ Profili i Pezulluar" }) }),
              /* @__PURE__ */ jsx("p", { className: styles$C.warningText, children: "Mungon kategoria, emri ose qyteti. Klientët nuk mund t'ju gjejnë!" }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  to: "/dashboard",
                  className: styles$C.fixLink,
                  onClick: () => setShowDropDown(false),
                  children: "Rregullo tani"
                }
              )
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: styles$C.strengthLabelRow, children: [
                /* @__PURE__ */ jsx("span", { children: "Fuqia e Profilit" }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      color: getStrengthColor(profileStrength),
                      fontWeight: "700"
                    },
                    children: [
                      profileStrength,
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: styles$C.progressBar, children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: styles$C.progressFill,
                  style: {
                    width: `${profileStrength}%`,
                    backgroundColor: getStrengthColor(profileStrength)
                  }
                }
              ) }),
              /* @__PURE__ */ jsx("p", { className: styles$C.strengthHint, children: profileStrength === 100 ? "✨ Profili juaj është i kompletuar!" : profileStrength === -1 ? "🚫 Profili juaj është i pezulluar. Plotësoni Emrin, Qytetin dhe Telefonin për t'u aktivizuar." : !(userData == null ? void 0 : userData.profilePic) || (userData == null ? void 0 : userData.profilePic.includes("placeholder")) ? "💡 Shto një foto profili për më shumë besueshmëri." : !(userData == null ? void 0 : userData.bio) || (userData == null ? void 0 : userData.bio.trim().length) <= 20 ? "✍️ Shkruaj një përshkrim më të gjatë (+20 shkronja) rreth punës sate." : (userData == null ? void 0 : userData.experienceYears) === void 0 || (userData == null ? void 0 : userData.experienceYears) === null || (userData == null ? void 0 : userData.experienceYears) === "" ? "⏳ Shto vitet e përvojës për të treguar profesionalizmin." : (userData == null ? void 0 : userData.startingPrice) === void 0 || (userData == null ? void 0 : userData.startingPrice) === null || (userData == null ? void 0 : userData.startingPrice) === "" ? "💰 Shto një çmim fillestar (ose 0 për me marrëveshje)." : !(userData == null ? void 0 : userData.portfolio) || (userData == null ? void 0 : userData.portfolio.length) === 0 ? "🖼️ Shto punime në portfolio për të bindur klientët." : !(userData == null ? void 0 : userData.isVerified) ? "🛡️ Verifiko profilin me ID për të fituar besim maksimal dhe distinktivin e verifikimit." : "🚀 Pothuajse gati!" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: styles$C.visibilityField, children: /* @__PURE__ */ jsxs("div", { className: styles$C.statusIndicator, children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: (userData == null ? void 0 : userData.isAvailable) ? styles$C.dotGreen : styles$C.dotGrey
                }
              ),
              (userData == null ? void 0 : userData.isAvailable) ? "Aktiv & Online" : "I fshehur (Pushim)"
            ] }) }),
            /* @__PURE__ */ jsx("hr", { className: styles$C.divider }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/dashboard",
                className: styles$C.dropdownItem,
                onClick: () => setShowDropDown(false),
                children: [
                  /* @__PURE__ */ jsx("span", { className: styles$C.icon, children: "📊" }),
                  "Paneli i Punës"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/profile",
                className: styles$C.dropdownItem,
                onClick: () => setShowDropDown(false),
                children: [
                  /* @__PURE__ */ jsx("span", { className: styles$C.icon, children: "👤" }),
                  "Profili Publik"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/settings",
                className: styles$C.dropdownItem,
                onClick: () => setShowDropDown(false),
                children: [
                  /* @__PURE__ */ jsx("span", { className: styles$C.icon, children: "⚙️" }),
                  "Cilësimet"
                ]
              }
            ),
            /* @__PURE__ */ jsx("hr", { className: styles$C.divider }),
            !(userData == null ? void 0 : userData.isPro) && /* @__PURE__ */ jsx(
              Link,
              {
                to: "/dashboard",
                className: styles$C.upgradePrompt,
                onClick: () => setShowDropDown(false),
                children: "🚀 Përmirëso rënditjen (PRO)"
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/help",
                className: styles$C.dropdownItem,
                onClick: () => setShowDropDown(false),
                children: [
                  /* @__PURE__ */ jsx("span", { className: styles$C.icon, children: "💡" }),
                  "Ndihmë & FAQ"
                ]
              }
            ),
            /* @__PURE__ */ jsx("hr", { className: styles$C.divider }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  auth.signOut();
                  setShowDropDown(false);
                },
                className: styles$C.logoutButton,
                children: [
                  /* @__PURE__ */ jsx("span", { className: styles$C.icon, children: "🚪" }),
                  "Dil nga llogaria"
                ]
              }
            )
          ] })
        ] }) : (
          /* LOGGED OUT VIEW - Added wrapper for easier CSS spacing */
          /* @__PURE__ */ jsxs("div", { className: styles$C.loggedOutActions, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: styles$C.favoritesTrigger,
                onClick: () => setShowFavorites(true),
                children: [
                  /* @__PURE__ */ jsx(
                    Heart,
                    {
                      size: 24,
                      color: favCount > 0 ? "#ff4d4d" : "#333",
                      fill: favCount > 0 ? "#ff4d4d" : "none",
                      strokeWidth: 2.3,
                      className: style.heartIcon
                    }
                  ),
                  favCount > 0 && /* @__PURE__ */ jsx("span", { className: styles$C.favBadge, children: favCount })
                ]
              }
            ),
            /* @__PURE__ */ jsx(Link, { to: "/workers", className: `${styles$C.searchIcon} `, children: /* @__PURE__ */ jsx("img", { src: Search$1, alt: "search icon" }) }),
            /* @__PURE__ */ jsxs(
              NavLink,
              {
                to: "/login",
                className: ({ isActive }) => isActive ? `${styles$C.navLinkLogIn} ${styles$C.logActive}` : styles$C.navLinkLogIn,
                children: [
                  /* @__PURE__ */ jsx("span", { className: styles$C.mobileLoginIcon, children: /* @__PURE__ */ jsx(User, { size: 20, color: "#ffffff", strokeWidth: 2.5 }) }),
                  /* @__PURE__ */ jsx("span", { className: styles$C.hideOnMobile, children: "Kyqu si mjeshtër" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Modal,
              {
                open: showFavorites,
                onClose: () => setShowFavorites(false),
                children: /* @__PURE__ */ jsxs("div", { className: styles$C.favModalContainer, children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: styles$C.modalCloseBtn,
                      onClick: () => setShowFavorites(false),
                      children: "✕"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: styles$C.favHeader, children: [
                    /* @__PURE__ */ jsx("h2", { children: "Mjeshtrit e Ruajtur" }),
                    /* @__PURE__ */ jsx("p", { children: "Koleksioni juaj i profesionistëve të preferuar" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: styles$C.favList, children: favoritesList.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    favoritesList.map((worker, index) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: styles$C.favItem,
                        style: { animationDelay: `${index * 0.05}s` },
                        children: [
                          /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: worker.profilePic || "https://via.placeholder.com/40",
                              className: styles$C.favAvatar,
                              alt: ""
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: styles$C.favMainInfo, children: [
                            /* @__PURE__ */ jsx("h4", { children: worker.fullName }),
                            /* @__PURE__ */ jsx("span", { className: styles$C.favTag, children: worker.category }),
                            /* @__PURE__ */ jsxs("p", { className: styles$C.favLocation, children: [
                              "📍 ",
                              worker.city
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: styles$C.favActions, children: [
                            /* @__PURE__ */ jsxs(
                              "a",
                              {
                                href: `tel:${worker.phoneNum}`,
                                className: styles$C.favCallBtn,
                                title: "Telefono",
                                children: [
                                  "📞 ",
                                  /* @__PURE__ */ jsx("span", { children: "Thirr" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              Link,
                              {
                                to: `/worker/${worker.id}`,
                                className: styles$C.favViewBtn,
                                onClick: () => setShowFavorites(false),
                                children: "Profili"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "button",
                              {
                                className: styles$C.favRemoveBtn,
                                onClick: () => removeFavorite(worker.id),
                                title: "Hiqe",
                                children: "🗑️"
                              }
                            )
                          ] })
                        ]
                      },
                      worker.id
                    )),
                    /* @__PURE__ */ jsx("div", { className: styles$C.favFooter, children: /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: styles$C.clearAllLink,
                        onClick: () => setSure(true),
                        children: "Fshij të gjithë listën"
                      }
                    ) })
                  ] }) : /* @__PURE__ */ jsxs("div", { className: styles$C.emptyState, children: [
                    /* @__PURE__ */ jsx("div", { className: styles$C.emptyIllustration, children: "❤️" }),
                    /* @__PURE__ */ jsx("h3", { children: "Lista është boshe" }),
                    /* @__PURE__ */ jsx("p", { children: "Nuk keni ruajtur asnjë mjeshtër ende." }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: styles$C.browseBtn,
                        onClick: () => setShowFavorites(false),
                        children: "Shfletoni Mjeshtrit"
                      }
                    )
                  ] }) })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(Modal, { open: sure, onClose: () => setSure(false), children: /* @__PURE__ */ jsxs("div", { className: styles$C.confirmModal, children: [
              /* @__PURE__ */ jsx("div", { className: styles$C.confirmIcon, children: "⚠️" }),
              /* @__PURE__ */ jsx("p", { children: "A jeni i sigurt që dëshironi të fshini të gjithë listën e të preferuarve?" }),
              /* @__PURE__ */ jsxs("div", { className: styles$C.confirmActions, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: styles$C.confirmYes,
                    onClick: () => {
                      localStorage.removeItem("mjeshtri_favs");
                      window.dispatchEvent(new Event("favoritesUpdated"));
                      setFavoritesList([]);
                      setSure(false);
                    },
                    children: "Po, fshije"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: styles$C.confirmNo,
                    onClick: () => setSure(false),
                    children: "Jo, anulo"
                  }
                )
              ] })
            ] }) })
          ] })
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("nav", { className: styles$C.mobileBottomNav, children: [
      /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/",
          className: ({ isActive }) => isActive ? `${styles$C.mobileTab} ${styles$C.activeTab}` : styles$C.mobileTab,
          children: [
            /* @__PURE__ */ jsx(Home$1, { size: 22, className: styles$C.tabIcon }),
            /* @__PURE__ */ jsx("span", { children: "Kryefaqja" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/workers",
          className: ({ isActive }) => isActive ? `${styles$C.mobileTab} ${styles$C.activeTab}` : styles$C.mobileTab,
          children: [
            /* @__PURE__ */ jsx(Search$2, { size: 22, className: styles$C.tabIcon }),
            /* @__PURE__ */ jsx("span", { children: "Kërko" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/wanted",
          className: ({ isActive }) => isActive ? `${styles$C.mobileTab} ${styles$C.activeTab}` : styles$C.mobileTab,
          children: [
            /* @__PURE__ */ jsx(Flame, { size: 22, className: styles$C.tabIcon }),
            /* @__PURE__ */ jsx("span", { children: "Popullore" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: user ? "/dashboard" : "/login",
          className: ({ isActive }) => isActive ? `${styles$C.mobileTab} ${styles$C.activeTab}` : styles$C.mobileTab,
          children: [
            user ? /* @__PURE__ */ jsx(LayoutDashboard, { size: 22, className: styles$C.tabIcon }) : /* @__PURE__ */ jsx(User, { size: 22, className: styles$C.tabIcon }),
            /* @__PURE__ */ jsx("span", { children: user ? "Paneli" : "Kyqu" })
          ]
        }
      )
    ] })
  ] });
}
const footer$1 = "_footer_12ohl_1";
const container$a = "_container_12ohl_13";
const grid$4 = "_grid_12ohl_25";
const section$2 = "_section_12ohl_65";
const description = "_description_12ohl_87";
const logoIcon = "_logoIcon_12ohl_101";
const links = "_links_12ohl_115";
const bottomBar = "_bottomBar_12ohl_169";
const text = "_text_12ohl_181";
const contactText = "_contactText_12ohl_191";
const contactBtn = "_contactBtn_12ohl_205";
const socialInfo = "_socialInfo_12ohl_247";
const styles$A = {
  footer: footer$1,
  container: container$a,
  grid: grid$4,
  section: section$2,
  description,
  logoIcon,
  links,
  bottomBar,
  text,
  contactText,
  contactBtn,
  socialInfo
};
const Logo = "/assets/footerLogo2-ct38r52o.png";
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: styles$A.footer, children: /* @__PURE__ */ jsxs("div", { className: styles$A.container, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$A.grid, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$A.section, children: [
        /* @__PURE__ */ jsx("img", { src: Logo, className: styles$A.logoIcon, alt: "Logo Icon" }),
        /* @__PURE__ */ jsx("p", { className: styles$A.description, children: "Platforma lider për gjetjen e mjeshtrit të duhur në Kosovë. Shërbime cilësore dhe të sigurta." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$A.section, children: [
        /* @__PURE__ */ jsx("h4", { children: "Navigimi" }),
        /* @__PURE__ */ jsxs("ul", { className: styles$A.links, children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Kryefaqja" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/about", children: "Rreth Nesh" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/terms", children: "Kushtet e Përdorimit" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/privacy", children: "Privatësia" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$A.section, children: [
        /* @__PURE__ */ jsx("h4", { children: "Na Kontaktoni" }),
        /* @__PURE__ */ jsx("p", { className: styles$A.contactText, children: "Keni pyetje apo nevojë për ndihmë?" }),
        /* @__PURE__ */ jsx(Link, { to: "/contact", className: styles$A.contactBtn, children: "Dërgo Mesazh" }),
        /* @__PURE__ */ jsx("div", { className: styles$A.socialInfo, children: /* @__PURE__ */ jsx("span", { children: "support@gjejnjerin.com" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$A.bottomBar, children: /* @__PURE__ */ jsx("p", { className: styles$A.text, children: "© 2026 GjejNjerin.com - Të gjitha të drejtat e rezervuara." }) })
  ] }) });
}
const MainLayout = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "container", style: { flex: 1, padding: "2rem 0" }, children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      " "
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const wrapper$3 = "_wrapper_1c63f_3";
const background = "_background_1c63f_35";
const orb = "_orb_1c63f_49";
const grid$3 = "_grid_1c63f_87";
const card$6 = "_card_1c63f_111";
const glitch = "_glitch_1c63f_145";
const subtitle$4 = "_subtitle_1c63f_205";
const desc = "_desc_1c63f_219";
const game = "_game_1c63f_235";
const gameTitle = "_gameTitle_1c63f_251";
const gameArea = "_gameArea_1c63f_269";
const pixel = "_pixel_1c63f_287";
const score = "_score_1c63f_307";
const homeBtn = "_homeBtn_1c63f_321";
const styles$z = {
  wrapper: wrapper$3,
  background,
  orb,
  grid: grid$3,
  card: card$6,
  glitch,
  subtitle: subtitle$4,
  desc,
  game,
  gameTitle,
  gameArea,
  pixel,
  score,
  homeBtn
};
function ErrorPage() {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [12, -12]);
  const rotateY = useTransform(mouseX, [-300, 300], [-12, 12]);
  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);
  const [score2, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const movePixel = () => {
    setScore((s) => s + 1);
    setPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$z.wrapper, children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "404 – Faqja nuk u gjet" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Faqja që po kërkoni nuk ekziston. Kthehuni në faqen kryesore për të vazhduar."
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, follow" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$z.background, children: [
      /* @__PURE__ */ jsx("span", { className: styles$z.orb }),
      /* @__PURE__ */ jsx("span", { className: styles$z.orb }),
      /* @__PURE__ */ jsx("span", { className: styles$z.orb }),
      /* @__PURE__ */ jsx("div", { className: styles$z.grid }),
      /* @__PURE__ */ jsx("div", { className: styles$z.scanlines })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: styles$z.card,
        style: { rotateX, rotateY },
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1 },
        children: [
          /* @__PURE__ */ jsx("h1", { className: styles$z.glitch, "data-text": "404", children: "404" }),
          /* @__PURE__ */ jsx("p", { className: styles$z.subtitle, children: "Faqja nuk u gjet" }),
          /* @__PURE__ */ jsx("p", { className: styles$z.desc, children: "Duket se kjo faqe është humbur në një dimension tjetër." }),
          /* @__PURE__ */ jsxs("div", { className: styles$z.game, children: [
            /* @__PURE__ */ jsx("p", { className: styles$z.gameTitle, children: "🎮 Kap pikselin e humbur" }),
            /* @__PURE__ */ jsx("div", { className: styles$z.gameArea, children: /* @__PURE__ */ jsx(
              motion.div,
              {
                className: styles$z.pixel,
                onClick: movePixel,
                animate: {
                  left: `${pos.x}%`,
                  top: `${pos.y}%`
                },
                transition: { type: "spring", stiffness: 200 }
              }
            ) }),
            /* @__PURE__ */ jsxs("p", { className: styles$z.score, children: [
              "Pikë: ",
              /* @__PURE__ */ jsx("strong", { children: score2 })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: styles$z.homeBtn,
              onClick: () => navigate("/"),
              children: "Kthehu në Fillim"
            }
          )
        ]
      }
    )
  ] });
}
const hero$3 = "_hero_u5zae_1";
const container$9 = "_container_u5zae_25";
const workerImage = "_workerImage_u5zae_47";
const title$f = "_title_u5zae_59";
const typeContainer = "_typeContainer_u5zae_81";
const hiddenWord = "_hiddenWord_u5zae_93";
const visibleWord = "_visibleWord_u5zae_103";
const questionMark = "_questionMark_u5zae_119";
const subtitle$3 = "_subtitle_u5zae_161";
const searchForm = "_searchForm_u5zae_177";
const searchInput = "_searchInput_u5zae_203";
const searchButton = "_searchButton_u5zae_233";
const styles$y = {
  hero: hero$3,
  container: container$9,
  workerImage,
  title: title$f,
  typeContainer,
  hiddenWord,
  visibleWord,
  questionMark,
  subtitle: subtitle$3,
  searchForm,
  searchInput,
  searchButton
};
const searchIcon$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ2SURBVHgBrVY9iyJBEO2Zi/0CIwXxYpM7UDA79Qfo/YRbM01uLxJBUBPB6HYjI9kVNTE6MyM1MVK4RUEwUhBNHTF3rl7fzKBjt+6y+6CZYbr6varq6upR2BXsdjs3Pe4VRflGz6AxAI3GC33/czweux6PZyXjUCTEQVr8RK8x9gqQ7TMJlUVCqoAcHv99LTmg6/oPrMHaC3EbeYkMi+wdIDFEUroQMDz/zT4AJPKLRB4sASPnSIvbbjwej1mtVmOLxYIdDgfm8/lYOBxmmUyG+f1+mYZGIl+xJ1xgv98/IY+nFiArFApsMBjISLgIhgRDt9sdV+G9nRyoVquc3OFwcJLRaMSm0ynrdDoslUpxG0TWarVkAjFe5uT9T03T9NPRaDT0QCCgR6NRfT6f6/Z5jEqlwm1CoZC+Xq+FNsRdVMn773bpbrdrpQA5FyGbzfK9QCpNezuIO4Zz8MU+gQ0FIpEIu4ZEInFmL0AQAheVA68AmfcmsD83EFRFX03i7XZ7bbE1f00IAiv7RzP0ZrMpXXiae9NeAE0okEwm+bPdbgvLEOQoY0RgHjwJXj7l8/kgszU2r9fLw0btY0wmE066XC5Zv99nuVyOzWYzbgu7eDzOnE7nBTt1hwcFh4FediJ5pACHSbQXqLDNZmNFUa/XL1oHleln3iroUAyYpD2DAP0IUZgeI+dIC+bS6bQl0uv1Tr1/drlcdzeb3S2YIsCJwHmzM0Q+rF0Tzz15/4h36xygf9NEib0T4DDJzwQAmijjsmD/L/W3QjM8L58JiiyxJ6qqFkVtXIIh2d6JLn3l2ipDKGV0XDRFswhWGOTxkP4mHolYGvE/pXNzBXkz8zoAAAAASUVORK5CYII=";
const Workers = "/assets/workers-BLyWTDM5.png";
const words = [
  { text: "mjeshtër", color: "#0004FF" },
  { text: "mekanik", color: "#51C6D3" },
  { text: "elektricist", color: "#0004FF" },
  { text: "moler", color: "#51C6D3" }
];
function Hero({ onSearch, searchQuery, setSearchQuery }) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  useEffect(() => {
    const currentWord = words[index].text;
    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        const humanTypingSpeed = Math.floor(Math.random() * (150 - 80 + 1)) + 80;
        setSpeed(humanTypingSpeed);
        if (displayText === currentWord) {
          setSpeed(1e3);
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setSpeed(75);
        if (displayText === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    };
    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, speed]);
  return /* @__PURE__ */ jsxs("section", { className: styles$y.hero, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$y.container, children: [
      /* @__PURE__ */ jsxs("h1", { className: styles$y.title, children: [
        "A po t'duhet një",
        " ",
        /* @__PURE__ */ jsxs("span", { className: styles$y.typeContainer, children: [
          /* @__PURE__ */ jsxs("span", { className: styles$y.hiddenWord, children: [
            words[index].text,
            "?"
          ] }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: styles$y.visibleWord,
              style: { color: words[index].color },
              children: [
                displayText,
                /* @__PURE__ */ jsx("span", { className: styles$y.questionMark, children: " ?" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: styles$y.subtitle, children: "Zgjidhja ideale për çdo nevojë të shtëpisë apo biznesit tuaj. Gjeni mjeshtrin e duhur dhe kryeni punën shpejt e sigurt." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: styles$y.searchForm, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Kërko mjeshtër...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: styles$y.searchInput
          }
        ),
        /* @__PURE__ */ jsx("button", { type: "submit", className: styles$y.searchButton, children: /* @__PURE__ */ jsx("img", { src: searchIcon$1, alt: "search button" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$y.imageCon, children: /* @__PURE__ */ jsx("img", { src: Workers, alt: "workers photo", className: styles$y.workerImage }) })
  ] });
}
const wrapper$2 = "_wrapper_1fwwn_1";
const header$2 = "_header_1fwwn_11";
const grid$2 = "_grid_1fwwn_49";
const tile = "_tile_1fwwn_67";
const icon$2 = "_icon_1fwwn_115";
const label$4 = "_label_1fwwn_137";
const backgroundAccent = "_backgroundAccent_1fwwn_163";
const styles$x = {
  wrapper: wrapper$2,
  header: header$2,
  grid: grid$2,
  tile,
  icon: icon$2,
  label: label$4,
  backgroundAccent
};
const categories$4 = [
  { id: 1, name: "Instalues", icon: "🔧", slug: "plumber", color: "#3b82f6" },
  {
    id: 2,
    name: "Elektricist",
    icon: "⚡",
    slug: "electrician",
    color: "#f59e0b"
  },
  { id: 3, name: "Klima / AC", icon: "❄️", slug: "hvac", color: "#06b6d4" },
  { id: 4, name: "Plastifikim", icon: "🧱", slug: "tiling", color: "#8b5cf6" },
  { id: 5, name: "Pastrim", icon: "🧹", slug: "cleaning", color: "#10b981" },
  { id: 6, name: "Më shumë", icon: "➜", slug: "all", color: "#0f172a" }
];
function CategoryGrid() {
  const navigate = useNavigate();
  const handleClick = (slug) => {
    navigate(`/workers?category=${slug}`);
  };
  return /* @__PURE__ */ jsxs("section", { className: styles$x.wrapper, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$x.header, children: [
      /* @__PURE__ */ jsx("h2", { children: "Kategoritë kryesore" }),
      /* @__PURE__ */ jsx("p", { children: "Zgjidh profesionin që të nevojitet" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$x.grid, children: categories$4.map((cat) => /* @__PURE__ */ jsxs(
      "button",
      {
        className: styles$x.tile,
        onClick: () => handleClick(cat.slug),
        style: { "--accent": cat.color },
        children: [
          /* @__PURE__ */ jsx("div", { className: styles$x.icon, children: cat.icon }),
          /* @__PURE__ */ jsx("span", { className: styles$x.label, children: cat.name }),
          /* @__PURE__ */ jsx("div", { className: styles$x.backgroundAccent })
        ]
      },
      cat.id
    )) })
  ] });
}
const button$1 = "_button_gmrfd_1";
const styles$w = {
  button: button$1
};
const proContent = "_proContent_1l98e_1";
const contactForm = "_contactForm_1l98e_93";
const inputGroup$5 = "_inputGroup_1l98e_105";
const label$3 = "_label_1l98e_121";
const input$4 = "_input_1l98e_105";
const phoneContainer$2 = "_phoneContainer_1l98e_171";
const actions = "_actions_1l98e_199";
const purchaseBtn = "_purchaseBtn_1l98e_217";
const cancelBtn = "_cancelBtn_1l98e_259";
const disabledBtn = "_disabledBtn_1l98e_289";
const styles$v = {
  proContent,
  contactForm,
  inputGroup: inputGroup$5,
  label: label$3,
  input: input$4,
  phoneContainer: phoneContainer$2,
  actions,
  purchaseBtn,
  cancelBtn,
  disabledBtn
};
function ContactForm({ workerId, workerPhone, workerName: workerName2 = "Mjeshtri", onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error2, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [countdown > 0]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;
    setError("");
    if (!workerId) {
      alert("Error: ID e mjeshtrit mungon.");
      return;
    }
    if (!customerPhone || customerPhone.length < 8) {
      alert("Ju lutem jepni një numër të vlefshëm.");
      return;
    }
    setLoading(true);
    try {
      const createSession = httpsCallable(functions$2, "createContactSession");
      await createSession({
        workerId,
        customerName: customerName || "Klient",
        customerPhone
      });
      const cleanPhone = workerPhone.replace(/\D/g, "");
      const message2 = encodeURIComponent(
        `Përshëndetje ${workerName2}, unë jam ${customerName}. Ju gjeta te GjejNjerin.com...`
      );
      window.location.href = `https://wa.me/${cleanPhone}?text=${message2}`;
    } catch (err) {
      if (err.code === "functions/resource-exhausted") {
        setError("Ngadalë pak! 👋 Keni dërguar shumë kërkesa. Prisni pak sekonda.");
        setCountdown(60);
      } else if (err.message) {
        setError(err.message);
      } else {
        setCountdown(60);
      }
      setTimeout(() => setError(""), 5e3);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$v.proContent, children: [
    " ",
    /* @__PURE__ */ jsx("h2", { children: "Kontakto Mjeshtrin" }),
    /* @__PURE__ */ jsx("p", { children: "Plotësoni të dhënat që mjeshtri t'ju identifikojë për vlerësim më vonë." }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: styles$v.contactForm, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$v.inputGroup, style: { animationDelay: "0.1s" }, children: [
        /* @__PURE__ */ jsx("label", { className: styles$v.label, children: "Emri juaj" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: styles$v.input,
            required: true,
            value: customerName,
            onChange: (e) => setCustomerName(e.target.value),
            placeholder: "Emri dhe Mbiemri"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$v.inputGroup, style: { animationDelay: "0.2s" }, children: [
        /* @__PURE__ */ jsx("label", { className: styles$v.label, children: "Numri i telefonit (WhatsApp)" }),
        /* @__PURE__ */ jsx(
          PhoneInput,
          {
            country: "xk",
            value: customerPhone,
            onChange: setCustomerPhone,
            containerClass: styles$v.phoneContainer,
            inputClass: styles$v.PhoneInput
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$v.actions, style: { animationDelay: "0.3s" }, children: [
        error2 && /* @__PURE__ */ jsx("p", { className: styles$v.errorMessage, style: { color: "#ef4444", marginBottom: "1rem", fontSize: "0.9rem" }, children: error2 }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: loading || countdown > 0,
            className: countdown > 0 ? styles$v.disabledBtn : styles$v.purchaseBtn,
            children: loading ? "Duke procesuar..." : countdown > 0 ? `Provo përsëri pas ${countdown}s` : "Vazhdo te WhatsApp"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: styles$v.cancelBtn,
            children: "Anulo"
          }
        )
      ] })
    ] })
  ] });
}
getFunctions();
function WhatsAppButton({ workerId, phoneNumber, workerName: workerName2, disabled }) {
  const [showContactModal, setShowContactModal] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: styles$w.button,
        onClick: () => setShowContactModal(true),
        disabled,
        children: "Kontakto në WhatsApp"
      }
    ),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: showContactModal,
        onClose: () => setShowContactModal(false),
        children: /* @__PURE__ */ jsx(
          ContactForm,
          {
            workerId,
            workerPhone: phoneNumber,
            workerName: workerName2,
            onClose: () => setShowContactModal(false)
          }
        )
      }
    )
  ] });
}
const card$5 = "_card_6vk1j_1";
const imageContainer = "_imageContainer_6vk1j_33";
const verifiedBadge$4 = "_verifiedBadge_6vk1j_61";
const image = "_image_6vk1j_33";
const priceCityCon = "_priceCityCon_6vk1j_97";
const mappin = "_mappin_6vk1j_119";
const cityCon = "_cityCon_6vk1j_129";
const name = "_name_6vk1j_141";
const city = "_city_6vk1j_129";
const priceLabel = "_priceLabel_6vk1j_203";
const priceAmount = "_priceAmount_6vk1j_221";
const priceContainer = "_priceContainer_6vk1j_237";
const buttonContainer = "_buttonContainer_6vk1j_251";
const category$1 = "_category_6vk1j_261";
const moreOptions = "_moreOptions_6vk1j_303";
const dotsBtn = "_dotsBtn_6vk1j_317";
const optionsDropdown = "_optionsDropdown_6vk1j_361";
const dropdownItem = "_dropdownItem_6vk1j_391";
const icon$1 = "_icon_6vk1j_447";
const divider = "_divider_6vk1j_457";
const rankBadge = "_rankBadge_6vk1j_495";
const verifyBadge = "_verifyBadge_6vk1j_585";
const proBadgeContainer$1 = "_proBadgeContainer_6vk1j_631";
const starIcon$3 = "_starIcon_6vk1j_663";
const heartBtn$1 = "_heartBtn_6vk1j_679";
const heartContainer$1 = "_heartContainer_6vk1j_713";
const heartOutline$1 = "_heartOutline_6vk1j_725";
const heartFill$1 = "_heartFill_6vk1j_739";
const active$4 = "_active_6vk1j_759";
const particles$1 = "_particles_6vk1j_825";
const styles$u = {
  card: card$5,
  imageContainer,
  verifiedBadge: verifiedBadge$4,
  image,
  priceCityCon,
  mappin,
  cityCon,
  name,
  city,
  priceLabel,
  priceAmount,
  priceContainer,
  buttonContainer,
  category: category$1,
  moreOptions,
  dotsBtn,
  optionsDropdown,
  dropdownItem,
  icon: icon$1,
  divider,
  rankBadge,
  verifyBadge,
  proBadgeContainer: proBadgeContainer$1,
  starIcon: starIcon$3,
  heartBtn: heartBtn$1,
  heartContainer: heartContainer$1,
  heartOutline: heartOutline$1,
  heartFill: heartFill$1,
  active: active$4,
  particles: particles$1
};
const MapPin = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFUSURBVHgBdVLbbYNAEDweBSABEp+kA1NBnApiKjAduIQoFbgExxUkHZAOTAfmEwmQ7p9XZtAtOSXySatb9mb2MYujrJMkSTqO4wluAQtMWDuO8+V53nvTNLVgHXHiON4ty1Kazw+AKzrzPO/hFzCS8rZtq43IStM0lQAp3C9a69ruJAiCFBVL13XVMAwZ3rXLB4DfUC0VEquHYXiJoujMpIyBlBPj+/5pqwjADVfddV1u5rzZFQHOOB9wJcl93z+55m0HW3sH6cjucGc0+ujk1eC+MWu6JhPlREU8aGRllYNUxOxaxjXYjViZqhz+ClIB9yxvaO1qkh6QtNpmgBAF+l9ge4nBf6ap33WtGGCPmziGfLflVtax10VhGBNxlJE7QJsl9hZYO6RQn7IuiTt2ZrYDwIVzAbyCmIjzI17IrP+INtn8YoqV/pIeHvPn3Gm2QPb5ASJtySS5IUpsAAAAAElFTkSuQmCC";
const Verified = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAASCAYAAACtmXuIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAS9SURBVHgB7VhPbFRFGP++FRJ6aAORmLBwqHhpbExq2ioqki3a6EW20S7WRtgsF1MSQ2+VCDRqSeQmmBS9SEtNrV0a2XjRVNsVqkbaxj2gsQexIek2MRgqNbEJwXF+M0zf9HUfb7qlF9hf8rJv582fb+b3fb/5ZpgKoUXEEjsoubmCYtGNopJKuCuYXyC6eYtzV/+i3NAPlKFBPu+vw0v+tYjKlqfoTComYtFNVMIaIn+dqPcCTfd/zw00wNOm3COkVdR0vixGm5+gjS4dgm2gfAOVsAqcu0Rz73wuSUlzDv81ITIyOpvFz65kAId6WZHyyRuCSlgdFCnn+HFEiiKk9UPxx+F4+F6R+pjpH0lCVNI28qsua6gmmsoTVchISbe7kYNwtSURxM7/G1yG+jbKy3Rk2uVBbc27DdOn3Y95N/bhv+rLZ9dKbC9kWxCOZzg78CY3ROg10ZTc5bZxw5jf8h4ZwOgvuvzGAjlhRtZ94X2m8StWoVhe9u1lHYUAHKH5A5a/pJ7uYa8fU/ZYB1PfmG7bd1G3Me92PTymT3wD3h703kfkfDAWFhQ2mH4M/HamPmJVlplYarsZE33hfcbnVH6kdokYkql1iScpHsbg+O8ggZd5qg18OyIn1tYoaOsKEwJ4Y912vRj123VZZpJpT50XcR0vCYrXeW3MBLv26jbdw4JOf8O0b+fyKMX8vn6LQjFzew5drwonr0b9qVmieK1Q9sYte70xhSL19LC2NQio/8qO/5KRbQ9SDYWgW07007HC3w5KAkyoZyaJ2nuZisHuaj0pABOdkF74XLX3fX5BO0SQU5SXsZLNYpG/znRALty+ZwXtftStjXYg6Si1UjlmvUSnsH0UiofKORZZ/4AIJeT4Xm/R4f3wCKBLljf4jD+ZLG6Tb6rVugs5QERWbVmqvZApW3IMIGuQBHggorMQQCIkDY8tLTawuFjQ13eSMzITrKK2KkpKdkcuLx0Tdj3dyTJzEjJyw/uT861c5+JVmKZhH3tFWyMM15OHVy2mwGW6bjGwZQveassV4JcsAzgFCJyaZeWphQBiz9zOBoM8FfMZv8KKYDtztL3e3qiNXPVd9Ei2ZQtjntwvqP0sq8THRQIxVmRmzjuUBOGQJUMwCiRgc7fJMN+ODhYnWYCRLZBiy9WdgAU+2KiTjb6x4HpYEDx3OjedkgsIzz7xpZ4D1MBELXB+0iuHjVVRoRyl7XmhCPXLFiLnvYTe28I2deDmLcpFrt2gbFjFU0mxKFMAjD6a5mWaCaOCZMMFRrb8cgUcSfOi7BzwyRZIQaS4TjwI6AfRAY8HufWPkFpsOB7GhSx27NEbPuQK8oY6eJQk+WQLUN8fdnPUq9c4x0i1vjosRl0yI2hi0Kaqs4p795DoP3/cbcCRXjzBTRF5Osz2XOCsSyOEe3QTshBv4SEzVVuQ6t7bJ/a1vts7K++1qJ8zi1cnx+TVSWIFVyfIrSs2CJlVUQmrRPonmnt3yLo6UZCXi8fk5aIrKSrj4NLl4mqhyPhCXi7225eLBjJSWp+h0f3yKmXrGofo/Q7sGT1Zyg78yKnC1+82WkU8UU9N2zaLmvURqnE5ZZbghvwcTf/5t8gOXYr00Gf8nf/7/7VrGz0pfb8UAAAAAElFTkSuQmCC";
function WorkerCard({ worker, rank, verifyIcon }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    const checkPersistence = () => {
      const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
      setIsFav(saved.some((item) => item.id === worker.id));
    };
    checkPersistence();
    window.addEventListener("favoritesUpdated", checkPersistence);
    window.addEventListener("storage", checkPersistence);
    return () => {
      window.removeEventListener("favoritesUpdated", checkPersistence);
      window.removeEventListener("storage", checkPersistence);
    };
  }, [worker.id]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    setIsFav(saved.some((item) => item.id === worker.id));
  }, [worker.id]);
  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    const isAlreadyFav = saved.some((item) => item.id === worker.id);
    let updated;
    if (isAlreadyFav) {
      updated = saved.filter((item) => item.id !== worker.id);
    } else {
      updated = [...saved, {
        id: worker.id,
        fullName: worker.fullName,
        category: worker.category,
        profilePic: worker.profilePic,
        phoneNum: worker.phoneNumber || worker.phoneNum,
        city: worker.city
      }];
    }
    localStorage.setItem("mjeshtri_favs", JSON.stringify(updated));
    setIsFav(!isAlreadyFav);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars2 = [];
    for (let i = 0; i < fullStars; i++) {
      stars2.push(/* @__PURE__ */ jsx("span", { children: "⭐" }, i));
    }
    if (hasHalfStar) {
      stars2.push(/* @__PURE__ */ jsx("span", { children: "✨" }, "half"));
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars2.push(/* @__PURE__ */ jsx("span", { children: "☆" }, `empty-${i}`));
    }
    return stars2;
  };
  function handleNavigate() {
    navigate(`/worker/${worker.id}`, { state: { workerData: worker } });
  }
  return /* @__PURE__ */ jsxs("div", { className: styles$u.card, onClick: handleNavigate, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$u.imageContainer, children: [
      rank && /* @__PURE__ */ jsxs("div", { className: styles$u.rankBadge, children: [
        "#",
        rank
      ] }),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: worker.profilePic || "https://via.placeholder.com/200?text=Worker",
          alt: worker.fullName,
          className: styles$u.image
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: styles$u.badgeWrapper, children: [
        worker.isVerified && /* @__PURE__ */ jsx("img", { src: Verified, className: verifyIcon ? styles$u.verifyBadge : styles$u.verifiedBadge, alt: "verified" }),
        worker.showProStar && /* @__PURE__ */ jsx("div", { className: styles$u.proBadgeContainer, title: "Anëtar PRO", children: /* @__PURE__ */ jsx("span", { className: styles$u.starIcon, children: "★" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$u.moreOptions, ref: menuRef, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: styles$u.dotsBtn,
            onClick: (e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            },
            children: "⋮"
          }
        ),
        showMenu && /* @__PURE__ */ jsxs("div", { className: styles$u.optionsDropdown, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/contact?subject=Problem&reported_id=${worker.id || worker.uid}&reported_name=${worker.fullName}`,
              className: styles$u.dropdownItem,
              children: [
                /* @__PURE__ */ jsx("span", { className: styles$u.icon, children: "🚩" }),
                " Raporto"
              ]
            }
          ),
          !auth.currentUser && /* @__PURE__ */ jsx("div", { className: styles$u.divider }),
          !auth.currentUser && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(e);
                setShowMenu(false);
              },
              className: styles$u.dropdownItem,
              children: [
                /* @__PURE__ */ jsx("span", { className: styles$u.icon, children: "❤️" }),
                " ",
                isFav ? "Hiqe" : "Ruaje"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$u.content, children: [
      /* @__PURE__ */ jsx("h3", { className: styles$u.name, children: worker.fullName }),
      /* @__PURE__ */ jsxs("div", { className: styles$u.priceCityCon, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$u.cityCon, children: [
          /* @__PURE__ */ jsx("img", { src: MapPin, className: styles$u.mappin, alt: "mapPin" }),
          /* @__PURE__ */ jsx("p", { className: styles$u.city, children: worker.city })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$u.priceContainer, children: [
          /* @__PURE__ */ jsx("span", { className: styles$u.priceLabel, children: "Cmimi:" }),
          /* @__PURE__ */ jsx("span", { className: styles$u.priceAmount, children: worker.startingPrice != null && worker.startingPrice !== 0 ? `${worker.startingPrice}€` : "Me marrëveshje" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: styles$u.category, children: worker.category }),
      /* @__PURE__ */ jsxs("div", { className: styles$u.rating, children: [
        /* @__PURE__ */ jsx("span", { className: styles$u.stars, children: renderStars(worker.rating) }),
        /* @__PURE__ */ jsx("span", { className: styles$u.ratingValue, children: worker.rating })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$u.buttonContainer, onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx(WhatsAppButton, { workerId: id || worker.uid, phoneNumber: worker.phoneNumber, workerName: worker.fullName }),
        !auth.currentUser && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: toggleFavorite,
            className: `${styles$u.heartBtn} ${isFav ? styles$u.active : ""}`,
            "aria-label": "Favorite",
            children: [
              /* @__PURE__ */ jsxs("div", { className: styles$u.heartContainer, children: [
                /* @__PURE__ */ jsx("svg", { className: styles$u.heartOutline, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }),
                /* @__PURE__ */ jsx("svg", { className: styles$u.heartFill, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" }) })
              ] }),
              isFav && /* @__PURE__ */ jsxs("div", { className: styles$u.particles, children: [
                /* @__PURE__ */ jsx("span", {}),
                /* @__PURE__ */ jsx("span", {}),
                /* @__PURE__ */ jsx("span", {}),
                /* @__PURE__ */ jsx("span", {})
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
const workerEntry = "_workerEntry_q8ygq_5";
const categoryNavWrapper = "_categoryNavWrapper_q8ygq_15";
const featuredWorkers = "_featuredWorkers_q8ygq_45";
const title$e = "_title_q8ygq_59";
const grid$1 = "_grid_q8ygq_85";
const viewAllButton = "_viewAllButton_q8ygq_127";
const categoryNav = "_categoryNav_q8ygq_15";
const categoryTab = "_categoryTab_q8ygq_237";
const activeTab$1 = "_activeTab_q8ygq_295";
const loaderContainer$2 = "_loaderContainer_q8ygq_337";
const spinner$5 = "_spinner_q8ygq_355";
const noResults$4 = "_noResults_q8ygq_407";
const viewAll = "_viewAll_q8ygq_127";
const styles$t = {
  workerEntry,
  categoryNavWrapper,
  featuredWorkers,
  title: title$e,
  grid: grid$1,
  viewAllButton,
  categoryNav,
  categoryTab,
  activeTab: activeTab$1,
  loaderContainer: loaderContainer$2,
  spinner: spinner$5,
  noResults: noResults$4,
  viewAll
};
const CATEGORIES = ["Të gjitha", "Instalues", "Elektricist", "Moler", "Mekanik"];
function FeaturedWorkers() {
  const [featuredWorkers2, setFeaturedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab2, setActiveTab] = useState("Të gjitha");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeaturedWorkers = async () => {
      const workersRef = collection(db, "workers");
      let q;
      try {
        setLoading(true);
        if (activeTab2 === "Të gjitha") {
          q = query(
            workersRef,
            where("isPro", "==", true),
            where("isFeatured", "==", true),
            where("isAvailable", "==", true),
            limit(10)
          );
        } else {
          q = query(
            workersRef,
            where("category", "==", activeTab2),
            where("isPro", "==", true),
            where("isFeatured", "==", true),
            limit(10)
          );
        }
        const querySnapshot = await getDocs(q);
        const allPros = querySnapshot.docs.map((doc2) => ({
          id: doc2.id,
          ...doc2.data()
        }));
        const shuffled = allPros.sort(() => 0.5 - Math.random()).slice(0, 3);
        setFeaturedWorkers(shuffled);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedWorkers();
  }, [activeTab2]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: styles$t.categoryNavWrapper, children: [
      /* @__PURE__ */ jsx("h2", { className: styles$t.title, children: "Mjeshtër të Rekomanduar" }),
      /* @__PURE__ */ jsx("div", { className: styles$t.categoryNav, children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxs(
        "button",
        {
          className: `${styles$t.categoryTab} ${activeTab2 === cat ? styles$t.activeTab : ""}`,
          onClick: () => setActiveTab(cat),
          children: [
            activeTab2 === cat && /* @__PURE__ */ jsx("span", { className: styles$t.activeDot }),
            cat
          ]
        },
        cat
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: styles$t.featuredWorkers, children: [
      /* @__PURE__ */ jsx("div", { className: styles$t.grid, children: loading ? /* @__PURE__ */ jsx("div", { className: styles$t.loaderContainer, children: /* @__PURE__ */ jsx("div", { className: styles$t.spinner }) }) : featuredWorkers2.length > 0 ? featuredWorkers2.map((worker, index) => (
        /* THE MAGIC IS HERE: Combine activeTab + id */
        /* @__PURE__ */ jsx(
          "div",
          {
            className: styles$t.workerEntry,
            style: { animationDelay: `${index * 0.1}s` },
            children: /* @__PURE__ */ jsx(
              WorkerCard,
              {
                worker,
                onClick: () => navigate(`/worker/${worker.id}`)
              }
            )
          },
          `${activeTab2}-${worker.id}`
        )
      )) : /* @__PURE__ */ jsx("div", { className: styles$t.noResults, children: "Nuk u gjet asnjë mjeshtër." }) }),
      !loading && featuredWorkers2.length === 0 && /* @__PURE__ */ jsx("div", { className: styles$t.viewAll, children: /* @__PURE__ */ jsx("button", { className: styles$t.viewAllButton, onClick: () => navigate("/workers"), children: "Shiko të gjithë mjeshtërit" }) })
    ] })
  ] });
}
const home = "_home_15nww_1";
const successModal = "_successModal_15nww_17";
const successGlow = "_successGlow_15nww_41";
const iconCircle = "_iconCircle_15nww_63";
const checkIcon = "_checkIcon_15nww_91";
const dualTitle = "_dualTitle_15nww_101";
const partWhite = "_partWhite_15nww_121";
const partGreen = "_partGreen_15nww_129";
const modalSubtitle = "_modalSubtitle_15nww_139";
const successInfoBox = "_successInfoBox_15nww_151";
const dashboardBtn = "_dashboardBtn_15nww_183";
const closeBtn$1 = "_closeBtn_15nww_227";
const proModal = "_proModal_15nww_509";
const partGold = "_partGold_15nww_533";
const proGlow = "_proGlow_15nww_543";
const badgeContainer = "_badgeContainer_15nww_567";
const proBadge$1 = "_proBadge_15nww_579";
const proInfoBox = "_proInfoBox_15nww_601";
const counterContainer = "_counterContainer_15nww_637";
const progressBar$1 = "_progressBar_15nww_645";
const progressFill$1 = "_progressFill_15nww_665";
const counterText = "_counterText_15nww_679";
const claimBtn = "_claimBtn_15nww_701";
const fireworksContainer = "_fireworksContainer_15nww_747";
const firework = "_firework_15nww_747";
const confirmEmail = "_confirmEmail_15nww_829";
const confirmEmailIcon = "_confirmEmailIcon_15nww_861";
const styles$s = {
  home,
  successModal,
  successGlow,
  iconCircle,
  checkIcon,
  dualTitle,
  partWhite,
  partGreen,
  modalSubtitle,
  successInfoBox,
  dashboardBtn,
  closeBtn: closeBtn$1,
  proModal,
  partGold,
  proGlow,
  badgeContainer,
  proBadge: proBadge$1,
  proInfoBox,
  counterContainer,
  progressBar: progressBar$1,
  progressFill: progressFill$1,
  counterText,
  claimBtn,
  fireworksContainer,
  firework,
  confirmEmail,
  confirmEmailIcon
};
const container$8 = "_container_hq0aw_3";
const title$d = "_title_hq0aw_23";
const blockCon = "_blockCon_hq0aw_49";
const cardWrapper = "_cardWrapper_hq0aw_63";
const visualBlock = "_visualBlock_hq0aw_79";
const bgLightBlue = "_bgLightBlue_hq0aw_109";
const bgAction = "_bgAction_hq0aw_111";
const animationArea = "_animationArea_hq0aw_125";
const worker1 = "_worker1_hq0aw_153";
const worker2 = "_worker2_hq0aw_155";
const worker3 = "_worker3_hq0aw_157";
const worker4 = "_worker4_hq0aw_159";
const worker5 = "_worker5_hq0aw_161";
const chatImg = "_chatImg_hq0aw_183";
const title2 = "_title2_hq0aw_203";
const subtitle$2 = "_subtitle_hq0aw_221";
const reviewImg = "_reviewImg_hq0aw_331";
const styles$r = {
  container: container$8,
  title: title$d,
  blockCon,
  cardWrapper,
  visualBlock,
  bgLightBlue,
  bgAction,
  animationArea,
  worker1,
  worker2,
  worker3,
  worker4,
  worker5,
  chatImg,
  title2,
  subtitle: subtitle$2,
  reviewImg
};
const Worker1 = "/assets/image1-D9GuPJw_.png";
const Worker2 = "/assets/image2-B97Z8AwC.png";
const Worker3 = "/assets/image3-AbsyoPhW.png";
const Chat = "/assets/chat-BQ66LAMT.png";
const Frame = "/assets/frame-C_KzOKpz.png";
function Banner() {
  return /* @__PURE__ */ jsxs("div", { className: styles$r.container, children: [
    /* @__PURE__ */ jsx("h2", { className: styles$r.title, children: "Zgjidhja e duhur për çdo shtëpi." }),
    /* @__PURE__ */ jsxs("div", { className: styles$r.blockCon, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$r.cardWrapper, children: [
        /* @__PURE__ */ jsx("div", { className: `${styles$r.visualBlock} ${styles$r.bgGray}`, children: /* @__PURE__ */ jsxs("div", { className: styles$r.animationArea, children: [
          /* @__PURE__ */ jsx("img", { src: Worker1, className: styles$r.worker1, alt: "worker" }),
          /* @__PURE__ */ jsx("img", { src: Worker2, className: styles$r.worker2, alt: "worker" }),
          /* @__PURE__ */ jsx("img", { src: Worker3, className: styles$r.worker3, alt: "worker" }),
          /* @__PURE__ */ jsx("img", { src: Worker1, className: styles$r.worker4, alt: "worker" }),
          /* @__PURE__ */ jsx("img", { src: Worker2, className: styles$r.worker5, alt: "worker" })
        ] }) }),
        /* @__PURE__ */ jsx("h3", { className: styles$r.title2, children: "Gjej mjeshtrin që të përshtatet" }),
        /* @__PURE__ */ jsx("p", { className: styles$r.subtitle, children: "Nga instalimet elektrike te lyerja e mureve, ne ju lidhim me profesionistët më të mirë të zonës suaj." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$r.cardWrapper, children: [
        /* @__PURE__ */ jsx("div", { className: `${styles$r.visualBlock} ${styles$r.bgLightBlue}`, children: /* @__PURE__ */ jsx("img", { src: Frame, className: styles$r.reviewImg }) }),
        /* @__PURE__ */ jsx("h3", { className: styles$r.title2, children: "Shiko eksperiencën" }),
        /* @__PURE__ */ jsx("p", { className: styles$r.subtitle, children: "Eksploro profilat e mjeshtërve (Ustahëve) dhe zgjidh atë që ka vlerësimet më të larta nga komuniteti." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$r.cardWrapper, children: [
        /* @__PURE__ */ jsx("div", { className: `${styles$r.visualBlock} ${styles$r.bgAction}`, children: /* @__PURE__ */ jsx("img", { src: Chat, className: styles$r.chatImg, alt: "chat ui" }) }),
        /* @__PURE__ */ jsx("h3", { className: styles$r.title2, children: "Kontakto direkt" }),
        /* @__PURE__ */ jsx("p", { className: styles$r.subtitle, children: "Pa ndërmjetës dhe pa vonesa. Bisedo detajet e punës dhe cakto terminin me një klikim në WhatsApp." })
      ] })
    ] })
  ] });
}
function Home() {
  var _a2, _b2;
  const navigate = useNavigate();
  const location = useLocation();
  const isModalOpen = (_a2 = location.state) == null ? void 0 : _a2.modalOpen;
  const name2 = (_b2 = location.state) == null ? void 0 : _b2.name;
  const [searchQuery, setSearchQuery] = useState("");
  const [metadata, setMetaData] = useState(null);
  const [showProModal, setShowProModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (authLoading || !user) return;
    const docRef = doc(db, "metadata", "globalStats");
    const fetchDoc = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMetaData(data);
          const hasSeenProModal = localStorage.getItem("proModalDismissed");
          if (data.workerCount < 50 && !hasSeenProModal && user) {
            setShowProModal(true);
          }
        }
      } catch (error2) {
        console.error("Error fetching metadata:", error2);
      }
    };
    fetchDoc();
  }, [user, authLoading]);
  const handleSearch = (query2) => {
    if (query2.trim()) {
      navigate(`/workers?search=${encodeURIComponent(query2)}`);
    } else {
      navigate("/workers");
    }
  };
  const handleCloseProModal = () => {
    localStorage.setItem("proModalDismissed", "true");
    setShowProModal(false);
  };
  const makePro = async () => {
    var _a3;
    if (isUpgrading) return;
    setIsUpgrading(true);
    try {
      const handlePro = httpsCallable(functions$2, "handleGetPro");
      const result = await handlePro();
      if ((_a3 = result.data) == null ? void 0 : _a3.success) {
        handleCloseProModal();
      }
    } catch (err) {
      console.error("Frontend registration error:", err);
      alert(err.message || "Ndodhi një gabim gjatë kalimit në PRO.");
    } finally {
      setIsUpgrading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$s.home, children: [
    /* @__PURE__ */ jsx(Hero, { onSearch: handleSearch, searchQuery, setSearchQuery }),
    /* @__PURE__ */ jsx(Banner, {}),
    /* @__PURE__ */ jsx(CategoryGrid, {}),
    /* @__PURE__ */ jsx(FeaturedWorkers, {}),
    /* @__PURE__ */ jsx(Modal, { open: showProModal, onClose: handleCloseProModal, children: /* @__PURE__ */ jsxs("div", { className: styles$s.proModal, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$s.fireworksContainer, children: [
        /* @__PURE__ */ jsx("div", { className: styles$s.firework }),
        /* @__PURE__ */ jsx("div", { className: styles$s.firework }),
        /* @__PURE__ */ jsx("div", { className: styles$s.firework })
      ] }),
      /* @__PURE__ */ jsx("div", { className: styles$s.proGlow }),
      /* @__PURE__ */ jsx("div", { className: styles$s.badgeContainer, children: /* @__PURE__ */ jsx("span", { className: styles$s.proBadge, children: "PRO FALAS" }) }),
      /* @__PURE__ */ jsxs("header", { className: styles$s.modalHeader, children: [
        /* @__PURE__ */ jsxs("h2", { className: styles$s.dualTitle, children: [
          /* @__PURE__ */ jsx("span", { className: styles$s.partWhite, children: "OFTUAR PËR" }),
          /* @__PURE__ */ jsx("span", { className: styles$s.partGold, children: "50 TË PARËT" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: styles$s.modalSubtitle, children: "Urime! Ju kualifikoheni për anëtarësim Premium" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$s.proInfoBox, children: [
        /* @__PURE__ */ jsx("p", { children: "Si një ndër anëtarët tanë të parë, përfitoni të gjitha funksionet PRO plotësisht falas për dy muaj." }),
        metadata && /* @__PURE__ */ jsxs("div", { className: styles$s.counterContainer, children: [
          /* @__PURE__ */ jsx("div", { className: styles$s.progressBar, children: /* @__PURE__ */ jsx(
            "div",
            {
              className: styles$s.progressFill,
              style: { width: `${metadata.workerCount / 50 * 100}%` }
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: styles$s.counterText, children: [
            /* @__PURE__ */ jsx("strong", { children: metadata.workerCount }),
            " nga 50 vende të zëna"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: styles$s.claimBtn,
          disabled: isUpgrading,
          onClick: makePro,
          children: isUpgrading ? "Duke u procesuar..." : "Përfito Pro Tani"
        }
      ),
      /* @__PURE__ */ jsx("button", { className: styles$s.closeBtn, onClick: handleCloseProModal, children: "Mbyll" })
    ] }) }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: isModalOpen,
        onClose: () => navigate("/", { replace: true, state: {} }),
        children: /* @__PURE__ */ jsxs("div", { className: styles$s.successModal, children: [
          /* @__PURE__ */ jsx("div", { className: styles$s.successGlow }),
          /* @__PURE__ */ jsx("div", { className: styles$s.iconCircle, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: styles$s.checkIcon, children: /* @__PURE__ */ jsx("path", { d: "M4.1 12.7L9 17.6 19.9 6.7", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
          /* @__PURE__ */ jsxs("header", { className: styles$s.modalHeader, children: [
            /* @__PURE__ */ jsxs("h2", { className: styles$s.dualTitle, children: [
              /* @__PURE__ */ jsx("span", { className: styles$s.partWhite, children: "MIRËSEVINI" }),
              /* @__PURE__ */ jsx("span", { className: styles$s.partGreen, children: name2 })
            ] }),
            /* @__PURE__ */ jsx("p", { className: styles$s.modalSubtitle, children: "Llogaria juaj u krijua me sukses" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$s.successInfoBox, children: [
            /* @__PURE__ */ jsx("p", { children: "Tani mund të plotësoni profilin tuaj, të shtoni punët në portofol dhe të filloni të merrni kërkesa nga klientët." }),
            /* @__PURE__ */ jsxs("p", { className: styles$s.confirmEmail, children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  className: styles$s.confirmEmailIcon,
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M4 6h16v12H4z",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.7",
                        strokeLinejoin: "round"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "m4 7 8 6 8-6",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.7",
                        strokeLinejoin: "round"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Një email për verifikimin e adresës suaj do t'ju dërgohet. Ju lutemi kontrolloni Inbox-in dhe Spam-in." })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: styles$s.dashboardBtn,
              onClick: () => navigate("/dashboard"),
              children: "Vazhdo te Paneli"
            }
          ),
          /* @__PURE__ */ jsx("button", { className: styles$s.closeBtn, onClick: () => navigate("/", { replace: true, state: {} }), children: "Mbyll" })
        ] })
      }
    )
  ] });
}
const sidebar$1 = "_sidebar_1wcj2_1";
const section1 = "_section1_1wcj2_27";
const section2 = "_section2_1wcj2_57";
const section4 = "_section4_1wcj2_85";
const searchIcon = "_searchIcon_1wcj2_99";
const input$3 = "_input_1wcj2_119";
const autocomplete = "_autocomplete_1wcj2_137";
const suggestionList = "_suggestionList_1wcj2_153";
const suggestionItem = "_suggestionItem_1wcj2_195";
const typeLabel = "_typeLabel_1wcj2_231";
const select$1 = "_select_1wcj2_273";
const section5 = "_section5_1wcj2_339";
const hiddenCheckbox = "_hiddenCheckbox_1wcj2_363";
const switchLabel = "_switchLabel_1wcj2_371";
const toggle = "_toggle_1wcj2_397";
const active$3 = "_active_1wcj2_415";
const toggleBall = "_toggleBall_1wcj2_425";
const toggleText = "_toggleText_1wcj2_455";
const verifiedBadge$3 = "_verifiedBadge_1wcj2_471";
const badgeIcon = "_badgeIcon_1wcj2_493";
const styles$q = {
  sidebar: sidebar$1,
  section1,
  section2,
  section4,
  searchIcon,
  input: input$3,
  autocomplete,
  suggestionList,
  suggestionItem,
  typeLabel,
  select: select$1,
  section5,
  hiddenCheckbox,
  switchLabel,
  toggle,
  active: active$3,
  toggleBall,
  toggleText,
  verifiedBadge: verifiedBadge$3,
  badgeIcon
};
const Search = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD+SURBVHgBjVHbDYJAELzl9c0nH7xK0A60A+3ADiyBWIFaAXYgVgAdaAkXAgk9EMDZ8y4xBhInGbhbdnZ2FxIaKTCOY4bjDvRBCVaWZZ0kYPKIH1EUHYjorBN/IYdh2Ldt++KLxZWRnHPyNE0X27bTuq4JldeIF2yOWOkDSh7HcQ5OcMlnqoskSUr+HoZhphx0z6Lv+9OcAC4qDsedESirruukmIeJ+0Yg9ZZWC4KUH5hPGgEPJrCJbC4bq851azf1DoIg9TzvKT5bKsCr4zhcjf8Lr3qlhdumaSoy7SBwN/ZLs2DwLZkbO7mue4T1RrtJsILb46uYJPEHdNsln989mWM3Wmko3wAAAABJRU5ErkJggg==";
function FilterSidebar({
  cities: cities2,
  categories: categories2,
  selectedCity,
  workerNames,
  selectedCategory,
  onCityChange,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  isVerified,
  onVerifiedChange
}) {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const normalize2 = (str) => str == null ? void 0 : str.toLowerCase().replace(/ë/g, "e").replace(/ç/g, "c").trim();
  const searchSuggestions = useMemo(() => {
    const query2 = normalize2(searchQuery);
    if (!query2 || query2.length < 2) return [];
    const matchedCats = categories2.filter((cat) => normalize2(cat).includes(query2) && cat !== "Të gjitha").map((cat) => ({ type: "Kategoria", value: cat }));
    const matchedNames = workerNames.filter((name2) => normalize2(name2).includes(query2)).slice(0, 5).map((name2) => ({ type: "Mjeshtri", value: name2 }));
    const matchedCities = cities2.filter((city2) => normalize2(city2).includes(normalize2(searchQuery))).map((city2) => ({ type: "Qyteti", value: city2 }));
    return [...matchedCats, ...matchedNames, ...matchedCities];
  }, [categories2, workerNames, searchQuery]);
  const categorySuggestions = useMemo(() => {
    if (!(selectedCategory == null ? void 0 : selectedCategory.trim())) return categories2;
    return categories2.filter(
      (cat) => normalize2(cat).includes(normalize2(selectedCategory))
    );
  }, [categories2, selectedCategory]);
  return /* @__PURE__ */ jsxs("aside", { className: styles$q.sidebar, children: [
    /* @__PURE__ */ jsx("div", { className: styles$q.section1, children: /* @__PURE__ */ jsxs("div", { className: styles$q.autocomplete, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Kërko (psh: Moler ose Emri)...",
          value: searchQuery,
          onChange: (e) => {
            onSearchChange(e.target.value);
            setIsSearchOpen(true);
          },
          onFocus: () => setIsSearchOpen(true),
          onBlur: () => setTimeout(() => setIsSearchOpen(false), 200),
          className: styles$q.input
        }
      ),
      /* @__PURE__ */ jsx("img", { src: Search, alt: "Search icon", className: styles$q.searchIcon }),
      isSearchOpen && searchSuggestions.length > 0 && /* @__PURE__ */ jsx("ul", { className: styles$q.suggestionList, children: searchSuggestions.map((item, index) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: styles$q.suggestionItem,
          onClick: () => {
            if (item.type === "Qyteti") {
              onCityChange(item.value);
              onSearchChange("");
            } else if (item.type === "Kategoria") {
              onCategoryChange(item.value);
              onSearchChange("");
            } else {
              onSearchChange(item.value);
            }
            setIsSearchOpen(false);
          },
          children: [
            /* @__PURE__ */ jsxs("small", { className: styles$q.typeLabel, children: [
              item.type,
              ":"
            ] }),
            " ",
            item.value
          ]
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: styles$q.section2, children: /* @__PURE__ */ jsx(
      "select",
      {
        value: selectedCity,
        onChange: (e) => onCityChange(e.target.value),
        className: styles$q.select,
        children: cities2.map((city2) => /* @__PURE__ */ jsx("option", { value: city2, children: city2 }, city2))
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: styles$q.section4, children: /* @__PURE__ */ jsxs("div", { className: styles$q.autocomplete, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: styles$q.input,
          placeholder: "Zgjidh kategorinë...",
          value: selectedCategory,
          onChange: (e) => {
            onCategoryChange(e.target.value);
            setIsCatOpen(true);
          },
          onFocus: () => setIsCatOpen(true),
          onBlur: () => setTimeout(() => setIsCatOpen(false), 200)
        }
      ),
      isCatOpen && categorySuggestions.length > 0 && /* @__PURE__ */ jsx("ul", { className: styles$q.suggestionList, children: categorySuggestions.map((cat) => /* @__PURE__ */ jsx(
        "li",
        {
          className: styles$q.suggestionItem,
          onClick: () => {
            onCategoryChange(cat);
            setIsCatOpen(false);
          },
          children: cat
        },
        cat
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: styles$q.section5, children: /* @__PURE__ */ jsxs("label", { className: styles$q.switchLabel, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          checked: isVerified,
          onChange: (e) => onVerifiedChange(e.target.checked),
          className: styles$q.hiddenCheckbox
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `${styles$q.toggle} ${isVerified ? styles$q.active : ""}`, children: /* @__PURE__ */ jsx("div", { className: styles$q.toggleBall }) }),
      /* @__PURE__ */ jsx("span", { className: styles$q.toggleText, children: "Verifikuar" }),
      /* @__PURE__ */ jsx("span", { className: styles$q.verifiedBadge, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", "aria-label": "Verified account", className: styles$q.badgeIcon, children: /* @__PURE__ */ jsx("path", { d: "M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.15-.44.23-.91.23-1.4 0-2.43-1.97-4.4-4.4-4.4-.49 0-.96.09-1.4.24-1.17-1.55-3.04-2.56-5.16-2.56-2.12 0-3.99 1.01-5.16 2.56-.44-.15-.91-.24-1.4-.24-2.43 0-4.4 1.97-4.4 4.4 0 .49.08.96.23 1.41-1.3.71-2.18 2.08-2.18 3.65 0 1.58.88 2.95 2.18 3.66-.15.44-.23.91-.23 1.4 0 2.43 1.97 4.4 4.4 4.4.49 0 .96-.09 1.4-.24 1.17 1.55 3.04 2.56 5.16 2.56 2.12 0 3.99-1.01 5.16-2.56.44.15.91.24 1.4.24 2.43 0 4.4-1.97 4.4-4.4 0-.49-.08-.96-.23-1.41 1.3-.71 2.18-2.08 2.18-3.66zm-13.42 4.4L5.5 13.32l1.45-1.45 2.13 2.13 5.3-5.3 1.45 1.45-6.75 6.75z", fill: "currentColor" }) }) })
    ] }) })
  ] });
}
const workerList = "_workerList_jd9ie_7";
const title$c = "_title_jd9ie_15";
const container$7 = "_container_jd9ie_41";
const resultsWrapper = "_resultsWrapper_jd9ie_61";
const grid = "_grid_jd9ie_79";
const loadingBar = "_loadingBar_jd9ie_101";
const active$2 = "_active_jd9ie_127";
const initialLoader = "_initialLoader_jd9ie_153";
const spinner$4 = "_spinner_jd9ie_171";
const dimmed = "_dimmed_jd9ie_191";
const resultsCount = "_resultsCount_jd9ie_209";
const noResults$3 = "_noResults_jd9ie_233";
const pagination = "_pagination_jd9ie_277";
const pageBtn = "_pageBtn_jd9ie_295";
const pageInfo = "_pageInfo_jd9ie_339";
const sidebarWrapper = "_sidebarWrapper_jd9ie_355";
const mobileFilterBtn = "_mobileFilterBtn_jd9ie_403";
const showMobile = "_showMobile_jd9ie_455";
const styles$p = {
  workerList,
  title: title$c,
  container: container$7,
  resultsWrapper,
  grid,
  loadingBar,
  active: active$2,
  initialLoader,
  spinner: spinner$4,
  dimmed,
  resultsCount,
  noResults: noResults$3,
  pagination,
  pageBtn,
  pageInfo,
  sidebarWrapper,
  mobileFilterBtn,
  showMobile
};
async function fetchUsers(city2, category2, isVerified) {
  try {
    const normalizedCategory = !(category2 == null ? void 0 : category2.trim()) || category2 === "Të gjitha" ? null : category2;
    const workersRef = collection(db, "workers");
    let constraints = [
      where("isActive", "==", true),
      where("isAvailable", "==", true),
      where("isSuspend", "==", false)
    ];
    if (isVerified) {
      constraints.push(where("isVerified", "==", true));
    }
    if (city2 && city2 !== "Të gjitha") {
      constraints.push(where("city", "==", city2));
    }
    if (normalizedCategory) {
      constraints.push(where("category", "==", normalizedCategory));
    }
    constraints.push(orderBy("fullName", "asc"));
    constraints.push(limit(100));
    const q = query(workersRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => ({
      id: doc2.id,
      ...doc2.data()
    }));
  } catch (error2) {
    console.error("Firebase Fetch Error:", error2);
    return [];
  }
}
const cities$2 = ["Të gjitha", "Prishtinë", "Ferizaj", "Prizren", "Gjakovë", "Mitrovicë", "Pejë"];
const categories$3 = [
  "Të gjitha",
  "Instalues",
  "Elektricist",
  "Hidraulik",
  "Klima/AC",
  "Plastifikim",
  "Pastrim",
  "Kopshtar",
  "Mekanik",
  "Moler",
  "Murator",
  "Ndërtimtari",
  "Pllakaxhi",
  "Zdrukthëtar",
  "Kulme dhe Tjegulla",
  "Fasada dhe Izolim",
  "Parket dhe Laminat",
  "Dyer dhe Dritare",
  "Saldator",
  "Gips dhe Tavane",
  "Vullkanizer",
  "IT",
  "Tjetër"
];
const getPublicCategory = (worker) => {
  var _a2;
  if (worker.categoryStatus === "approved" && ((_a2 = worker.customCategory) == null ? void 0 : _a2.trim())) {
    return worker.customCategory.trim();
  }
  return worker.category || "Tjetër";
};
function WorkerList() {
  const [searchParams] = useSearchParams();
  useNavigate();
  const [selectedCity, setSelectedCity] = useState("Të gjitha");
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Të gjitha");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;
  const { data: allWorkers, isLoading, isFetching } = useQuery({
    queryKey: ["workers", selectedCity, selectedCategory, isVerifiedOnly],
    queryFn: () => fetchUsers(selectedCity, selectedCategory, isVerifiedOnly),
    placeholderData: (previousData) => previousData,
    staleTime: 1e3 * 60 * 5
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, selectedCategory, debouncedSearchQuery]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    if (categoryParam) {
      const categoryMap = {
        plumber: "Instalues",
        electrician: "Elektricist",
        hvac: "Klima/AC",
        tiling: "Plastifikim",
        cleaning: "Pastrim",
        gardener: "Kopshtar",
        mechanic: "Mekanik",
        painter: "Moler",
        mason: "Murator",
        "tire-service": "Vullkanizer",
        // All/Reset
        all: "Të gjitha"
      };
      setSelectedCategory(categoryMap[categoryParam] || "Të gjitha");
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedSearchQuery("");
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const filteredWorkers = useMemo(() => {
    if (!allWorkers) return [];
    const filtered = allWorkers.filter((worker) => {
      var _a2, _b2;
      const matchesCity = selectedCity === "Të gjitha" || worker.city === selectedCity;
      const publicCategory = getPublicCategory(worker);
      const matchesCategory = !(selectedCategory == null ? void 0 : selectedCategory.trim()) || selectedCategory === "Të gjitha" || publicCategory === selectedCategory;
      const searchStr = debouncedSearchQuery.toLowerCase();
      const matchesSearch = !searchStr || ((_a2 = worker.fullName) == null ? void 0 : _a2.toLowerCase().includes(searchStr)) || publicCategory.toLowerCase().includes(searchStr) || ((_b2 = worker.city) == null ? void 0 : _b2.toLowerCase().includes(searchStr));
      return matchesCity && matchesCategory && matchesSearch;
    });
    return filtered.sort((a, b) => {
      const getScore = (w) => {
        let score2 = 0;
        if (w.isPro) score2 += 1e3;
        if (w.isVerified) score2 += 200;
        score2 += Number(w.reviewCount || 0) * 5;
        return score2;
      };
      return getScore(b) - getScore(a);
    });
  }, [allWorkers, debouncedSearchQuery, selectedCity, selectedCategory]);
  const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage) || 1;
  const paginatedWorkers = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredWorkers.slice(firstIndex, lastIndex);
  }, [filteredWorkers, currentPage]);
  const workersCount = () => {
    if (filteredWorkers.length === 1) {
      return "Një mjeshtër u gjetë";
    } else {
      return `${filteredWorkers.length} mjeshtër u gjetën`;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$p.workerList, children: [
    /* @__PURE__ */ jsx("div", { className: `${styles$p.loadingBar} ${isFetching ? styles$p.active : ""}` }),
    /* @__PURE__ */ jsx("h1", { className: styles$p.title, children: "Kërko punëtorin e duhur" }),
    /* @__PURE__ */ jsxs("div", { className: styles$p.container, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: styles$p.mobileFilterBtn,
          onClick: () => setShowFilters((prev) => !prev),
          children: showFilters ? "Mbyll Filtrat" : "Filtrat"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `${styles$p.sidebarWrapper} ${showFilters ? styles$p.showMobile : ""}`, children: /* @__PURE__ */ jsx(
        FilterSidebar,
        {
          cities: cities$2,
          categories: categories$3,
          workerNames: (allWorkers == null ? void 0 : allWorkers.map((w) => w.fullName)) || [],
          selectedCity,
          selectedCategory,
          isVerified: isVerifiedOnly,
          onVerifiedChange: setIsVerifiedOnly,
          onCityChange: setSelectedCity,
          onCategoryChange: setSelectedCategory,
          searchQuery,
          onSearchChange: setSearchQuery
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: styles$p.results, children: [
        /* @__PURE__ */ jsx("p", { className: styles$p.resultsCount, children: isLoading ? "Duke kërkuar mjeshtrit..." : workersCount() }),
        /* @__PURE__ */ jsx("div", { className: styles$p.resultsWrapper, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles$p.initialLoader, children: [
          /* @__PURE__ */ jsx("div", { className: styles$p.spinner }),
          /* @__PURE__ */ jsx("p", { className: styles$p.loadingText, children: "Duke u sinkronizuar me GjejNjerin.com..." })
        ] }) : /* @__PURE__ */ jsx(Fragment, { children: paginatedWorkers.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: `${styles$p.grid} ${isFetching ? styles$p.dimmed : ""}`, children: paginatedWorkers.map((worker) => /* @__PURE__ */ jsx(
            WorkerCard,
            {
              worker: {
                ...worker,
                category: getPublicCategory(worker)
              }
            },
            worker.id
          )) }),
          totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: styles$p.pagination, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: styles$p.pageBtn,
                onClick: () => {
                  setCurrentPage((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                },
                disabled: currentPage === 1,
                children: "Mbrapa"
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: styles$p.pageInfo, children: [
              "Faqja ",
              /* @__PURE__ */ jsx("strong", { children: currentPage }),
              " nga ",
              /* @__PURE__ */ jsx("strong", { children: totalPages })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: styles$p.pageBtn,
                onClick: () => {
                  setCurrentPage((prev) => prev + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                },
                disabled: currentPage === totalPages,
                children: "Para"
              }
            )
          ] })
        ] }) : !isFetching && /* @__PURE__ */ jsx("div", { className: styles$p.noResults, children: /* @__PURE__ */ jsx("p", { children: "Nuk u gjet asnjë mjeshtër me këto kritere." }) }) }) })
      ] })
    ] })
  ] });
}
const page$2 = "_page_13crz_3";
const hero$2 = "_hero_13crz_19";
const heroBg$1 = "_heroBg_13crz_37";
const heroContent$2 = "_heroContent_13crz_57";
const heroMain$1 = "_heroMain_13crz_75";
const imageFrame$3 = "_imageFrame_13crz_87";
const mainAvatar$1 = "_mainAvatar_13crz_103";
const expTag$1 = "_expTag_13crz_119";
const expNum$1 = "_expNum_13crz_145";
const expLabel$1 = "_expLabel_13crz_147";
const topBadges$1 = "_topBadges_13crz_151";
const catBadge$1 = "_catBadge_13crz_153";
const verifiedPro$1 = "_verifiedPro_13crz_155";
const heroTitle$3 = "_heroTitle_13crz_159";
const heroStats$1 = "_heroStats_13crz_177";
const statItem$1 = "_statItem_13crz_179";
const starIcon$2 = "_starIcon_13crz_183";
const statDivider$1 = "_statDivider_13crz_185";
const bodyContainer$1 = "_bodyContainer_13crz_189";
const contentGrid$1 = "_contentGrid_13crz_191";
const cardSection$1 = "_cardSection_13crz_195";
const miniTitle$1 = "_miniTitle_13crz_197";
const descriptionText$1 = "_descriptionText_13crz_199";
const portfolioDisplay$1 = "_portfolioDisplay_13crz_205";
const portfolioItem$1 = "_portfolioItem_13crz_207";
const stickyCard$1 = "_stickyCard_13crz_215";
const priceHeader$1 = "_priceHeader_13crz_217";
const actionButtons$3 = "_actionButtons_13crz_221";
const secondaryCallBtn$1 = "_secondaryCallBtn_13crz_237";
const trustFooter$1 = "_trustFooter_13crz_237";
const feedbackSection$1 = "_feedbackSection_13crz_237";
const feedbackHeader$1 = "_feedbackHeader_13crz_237";
const feedbackGrid$1 = "_feedbackGrid_13crz_237";
const modernReviewCard$1 = "_modernReviewCard_13crz_237";
const reviewScore$1 = "_reviewScore_13crz_237";
const starFilled$1 = "_starFilled_13crz_237";
const starEmpty$1 = "_starEmpty_13crz_237";
const reviewText$1 = "_reviewText_13crz_237";
const reviewerInfo$1 = "_reviewerInfo_13crz_237";
const reviewerAvatar$1 = "_reviewerAvatar_13crz_237";
const reviewerName$1 = "_reviewerName_13crz_237";
const reviewDate$1 = "_reviewDate_13crz_237";
const mobileAction$1 = "_mobileAction_13crz_237";
const mobileActionInner$1 = "_mobileActionInner_13crz_237";
const mobilePricing$1 = "_mobilePricing_13crz_237";
const loader$1 = "_loader_13crz_237";
const errorPageWrapper = "_errorPageWrapper_13crz_243";
const errorCircleBg = "_errorCircleBg_13crz_267";
const errorCard$3 = "_errorCard_13crz_289";
const errorIconWrapper = "_errorIconWrapper_13crz_315";
const lockEmoji = "_lockEmoji_13crz_339";
const iconPulse = "_iconPulse_13crz_349";
const errorTitle$3 = "_errorTitle_13crz_377";
const errorSubtext = "_errorSubtext_13crz_391";
const backBtn = "_backBtn_13crz_421";
const helpText = "_helpText_13crz_461";
const verifiedBadge$2 = "_verifiedBadge_13crz_473";
const heartBtn = "_heartBtn_13crz_505";
const heartContainer = "_heartContainer_13crz_545";
const heartOutline = "_heartOutline_13crz_557";
const heartFill = "_heartFill_13crz_575";
const active$1 = "_active_13crz_599";
const particles = "_particles_13crz_665";
const bookingSidebar$1 = "_bookingSidebar_13crz_739";
const portfolioScrollContainer$1 = "_portfolioScrollContainer_13crz_791";
const styles$o = {
  page: page$2,
  hero: hero$2,
  heroBg: heroBg$1,
  heroContent: heroContent$2,
  heroMain: heroMain$1,
  imageFrame: imageFrame$3,
  mainAvatar: mainAvatar$1,
  expTag: expTag$1,
  expNum: expNum$1,
  expLabel: expLabel$1,
  topBadges: topBadges$1,
  catBadge: catBadge$1,
  verifiedPro: verifiedPro$1,
  heroTitle: heroTitle$3,
  heroStats: heroStats$1,
  statItem: statItem$1,
  starIcon: starIcon$2,
  statDivider: statDivider$1,
  bodyContainer: bodyContainer$1,
  contentGrid: contentGrid$1,
  cardSection: cardSection$1,
  miniTitle: miniTitle$1,
  descriptionText: descriptionText$1,
  portfolioDisplay: portfolioDisplay$1,
  portfolioItem: portfolioItem$1,
  stickyCard: stickyCard$1,
  priceHeader: priceHeader$1,
  actionButtons: actionButtons$3,
  secondaryCallBtn: secondaryCallBtn$1,
  trustFooter: trustFooter$1,
  feedbackSection: feedbackSection$1,
  feedbackHeader: feedbackHeader$1,
  feedbackGrid: feedbackGrid$1,
  modernReviewCard: modernReviewCard$1,
  reviewScore: reviewScore$1,
  starFilled: starFilled$1,
  starEmpty: starEmpty$1,
  reviewText: reviewText$1,
  reviewerInfo: reviewerInfo$1,
  reviewerAvatar: reviewerAvatar$1,
  reviewerName: reviewerName$1,
  reviewDate: reviewDate$1,
  mobileAction: mobileAction$1,
  mobileActionInner: mobileActionInner$1,
  mobilePricing: mobilePricing$1,
  loader: loader$1,
  errorPageWrapper,
  errorCircleBg,
  errorCard: errorCard$3,
  errorIconWrapper,
  lockEmoji,
  iconPulse,
  errorTitle: errorTitle$3,
  errorSubtext,
  backBtn,
  helpText,
  verifiedBadge: verifiedBadge$2,
  heartBtn,
  heartContainer,
  heartOutline,
  heartFill,
  active: active$1,
  particles,
  bookingSidebar: bookingSidebar$1,
  portfolioScrollContainer: portfolioScrollContainer$1
};
function WorkerProfile({ initialData = null }) {
  var _a2, _b2;
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialWorker = (initialData == null ? void 0 : initialData.worker) || ((_a2 = location.state) == null ? void 0 : _a2.workerData) || null;
  const [worker, setWorker] = useState(initialWorker);
  const [reviews, setReviews] = useState((initialData == null ? void 0 : initialData.reviews) || []);
  const [loading, setLoading] = useState(!initialWorker);
  const [isFav, setIsFav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (!(worker == null ? void 0 : worker.id)) return;
    const checkPersistence = () => {
      const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
      setIsFav(saved.some((item) => item.id === worker.id));
    };
    checkPersistence();
    window.addEventListener("favoritesUpdated", checkPersistence);
    window.addEventListener("storage", checkPersistence);
    return () => {
      window.removeEventListener("favoritesUpdated", checkPersistence);
      window.removeEventListener("storage", checkPersistence);
    };
  }, [worker == null ? void 0 : worker.id]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);
  const toggleFavorite = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    const isAlreadyFav = saved.some((item) => item.id === worker.id);
    let updated;
    if (isAlreadyFav) {
      updated = saved.filter((item) => item.id !== worker.id);
    } else {
      updated = [...saved, {
        id: worker.id,
        fullName: worker.fullName,
        category: worker.category,
        profilePic: worker.profilePic,
        phoneNum: worker.phoneNumber || worker.phoneNum,
        city: worker.city
      }];
    }
    localStorage.setItem("mjeshtri_favs", JSON.stringify(updated));
    setIsFav(!isAlreadyFav);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    if ((initialData == null ? void 0 : initialData.worker) && (id && initialData.worker.id === id || slug && initialData.worker.slug === slug)) {
      setWorker(initialData.worker);
      setReviews(initialData.reviews || []);
      setLoading(false);
      return;
    }
    const fetchWorkerAndReviews = async () => {
      var _a3;
      setLoading(true);
      try {
        let finalWorkerData = ((_a3 = location.state) == null ? void 0 : _a3.workerData) || null;
        if (!finalWorkerData) {
          if (id) {
            const docRef = doc(db, "workers", id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              finalWorkerData = {
                id: snap.id,
                ...snap.data()
              };
            }
          } else if (slug) {
            const q = query(
              collection(db, "workers"),
              where("slug", "==", slug)
            );
            const qSnap = await getDocs(q);
            if (!qSnap.empty) {
              const data = qSnap.docs[0].data();
              if (data.isPro) {
                finalWorkerData = {
                  id: qSnap.docs[0].id,
                  ...data
                };
              }
            }
          }
        }
        if (finalWorkerData) {
          setWorker(finalWorkerData);
          const qReviews = query(
            collection(db, "reviews"),
            where("workerId", "==", finalWorkerData.id),
            where("status", "==", "approved"),
            orderBy("createdAt", "desc")
          );
          const revSnap = await getDocs(qReviews);
          setReviews(
            revSnap.docs.map((d) => ({
              id: d.id,
              ...d.data()
            }))
          );
        } else {
          setWorker(null);
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setWorker(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerAndReviews();
  }, [id, slug, initialData]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: styles$o.loader, children: /* @__PURE__ */ jsx("span", {}) });
  }
  if (!worker) {
    return /* @__PURE__ */ jsxs("div", { className: styles$o.errorPageWrapper, children: [
      /* @__PURE__ */ jsx("div", { className: styles$o.errorCircleBg }),
      /* @__PURE__ */ jsxs("div", { className: styles$o.errorCard, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$o.errorIconWrapper, children: [
          /* @__PURE__ */ jsx("span", { className: styles$o.lockEmoji, children: "🔒" }),
          /* @__PURE__ */ jsx("div", { className: styles$o.iconPulse })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: styles$o.errorTitle, children: "Link i Kufizuar" }),
        /* @__PURE__ */ jsxs("p", { className: styles$o.errorSubtext, children: [
          "Ky profil kërkon një anëtarësim ",
          /* @__PURE__ */ jsx("span", { children: "PRO" }),
          " për t'u hapur nëpërmjet linkut të personalizuar."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$o.errorActionArea, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => navigate("/"), className: styles$o.backBtn, children: "Kthehu në Ballinë" }),
          /* @__PURE__ */ jsx("p", { className: styles$o.helpText, children: "Nëse jeni ju pronari i këtij profili, ju lutem kyçuni." })
        ] })
      ] })
    ] });
  }
  const whatsappPhone = String(
    worker.phoneNumber || worker.phoneNum || ""
  ).replace(/\D/g, "");
  const profilePath = worker.isPro && worker.slug ? `/${worker.slug}` : `/worker/${worker.id}`;
  const profileUrl = `https://gjejnjerin.com${profilePath}`;
  const seoDescription = (worker.bio || `${worker.fullName} është ${worker.category} në ${worker.city}, Kosovë. Kontaktoje përmes Gjejnjerin.`).replace(/\s+/g, " ").trim().slice(0, 160);
  const seoTitle = `${worker.fullName} - ${worker.category} në ${worker.city} | Gjejnjerin`;
  return /* @__PURE__ */ jsxs("div", { className: styles$o.page, children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: seoDescription }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: profileUrl }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "profile" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: profileUrl }),
      worker.profilePic && /* @__PURE__ */ jsx("meta", { property: "og:image", content: worker.profilePic }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: seoDescription })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: styles$o.hero, children: [
      /* @__PURE__ */ jsx("div", { className: styles$o.heroBg, style: { backgroundImage: `url(${worker.profilePic})` } }),
      /* @__PURE__ */ jsx("div", { className: styles$o.heroContent, children: /* @__PURE__ */ jsxs("div", { className: styles$o.heroMain, children: [
        /* @__PURE__ */ jsx("div", { className: styles$o.visualSide, children: /* @__PURE__ */ jsxs("div", { className: styles$o.imageFrame, children: [
          /* @__PURE__ */ jsx("img", { src: worker.profilePic, alt: worker.fullName, className: styles$o.mainAvatar }),
          /* @__PURE__ */ jsxs("div", { className: styles$o.expTag, children: [
            /* @__PURE__ */ jsxs("span", { className: styles$o.expNum, children: [
              worker.experienceYears || 0,
              "+"
            ] }),
            /* @__PURE__ */ jsx("span", { className: styles$o.expLabel, children: "VITE PËRVOJË" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: styles$o.textSide, children: [
          !isAuthenticated && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: toggleFavorite,
              className: `${styles$o.heartBtn} ${isFav ? styles$o.active : ""}`,
              "aria-label": "Favorite",
              children: [
                /* @__PURE__ */ jsxs("div", { className: styles$o.heartContainer, children: [
                  /* @__PURE__ */ jsx("svg", { className: styles$o.heartOutline, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }) }),
                  /* @__PURE__ */ jsx("svg", { className: styles$o.heartFill, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" }) })
                ] }),
                isFav && /* @__PURE__ */ jsxs("div", { className: styles$o.particles, children: [
                  /* @__PURE__ */ jsx("span", {}),
                  /* @__PURE__ */ jsx("span", {}),
                  /* @__PURE__ */ jsx("span", {}),
                  /* @__PURE__ */ jsx("span", {})
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: styles$o.topBadges, children: [
            /* @__PURE__ */ jsx("span", { className: styles$o.catBadge, children: worker.category }),
            worker.showProStar && /* @__PURE__ */ jsx("span", { className: styles$o.verifiedPro, children: "PRO" }),
            worker.isVerified && /* @__PURE__ */ jsx("span", { className: styles$o.verifiedBadge, children: /* @__PURE__ */ jsx("img", { src: Verified, alt: "verified badge" }) })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: styles$o.heroTitle, children: worker.fullName }),
          /* @__PURE__ */ jsxs("div", { className: styles$o.heroStats, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$o.statItem, children: [
              /* @__PURE__ */ jsx("img", { src: MapPin, alt: "location" }),
              /* @__PURE__ */ jsxs("span", { children: [
                worker.city,
                ", KS"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$o.statDivider }),
            /* @__PURE__ */ jsxs("div", { className: styles$o.statItem, children: [
              /* @__PURE__ */ jsx("span", { className: styles$o.starIcon, children: "★" }),
              /* @__PURE__ */ jsxs("span", { children: [
                worker.rating || "5.0",
                " Score"
              ] })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$o.bodyContainer, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$o.contentGrid, children: [
        /* @__PURE__ */ jsxs("main", { className: styles$o.detailsArea, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$o.cardSection, children: [
            /* @__PURE__ */ jsx("h3", { className: styles$o.miniTitle, children: "Rreth Meje" }),
            /* @__PURE__ */ jsx("p", { className: styles$o.descriptionText, children: worker.bio || "Ky mjeshtër nuk ka shtuar ende një biografi." })
          ] }),
          ((_b2 = worker.portfolio) == null ? void 0 : _b2.length) > 0 && /* @__PURE__ */ jsxs("div", { className: styles$o.cardSection, children: [
            /* @__PURE__ */ jsx("h3", { className: styles$o.miniTitle, children: "Punimet e fundit" }),
            /* @__PURE__ */ jsx("div", { className: styles$o.portfolioScrollContainer, children: /* @__PURE__ */ jsx("div", { className: styles$o.portfolioDisplay, children: worker.portfolio.map((img, i) => /* @__PURE__ */ jsx("div", { className: styles$o.portfolioItem, children: /* @__PURE__ */ jsx("img", { src: img, alt: `Work ${i}` }) }, i)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("aside", { className: styles$o.bookingSidebar, children: /* @__PURE__ */ jsxs("div", { className: styles$o.stickyCard, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$o.priceHeader, children: [
            /* @__PURE__ */ jsx("p", { children: "Tarifa Fillestare" }),
            /* @__PURE__ */ jsx("h2", { children: worker.startingPrice ? `${worker.startingPrice}€` : "Me marrëveshje" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$o.actionButtons, children: [
            /* @__PURE__ */ jsx(
              WhatsAppButton,
              {
                workerId: worker.id,
                phoneNumber: worker.phoneNumber,
                workerName: worker.fullName
              }
            ),
            whatsappPhone && /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/${whatsappPhone}`,
                target: "_blank",
                rel: "noreferrer",
                className: styles$o.secondaryCallBtn,
                children: "Bisedo direkt"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$o.trustFooter, children: [
            /* @__PURE__ */ jsx("p", { children: "✓ Verifikuar nga GjejNjerin.com" }),
            worker.quickResponse === true && /* @__PURE__ */ jsx("p", { children: "✓ Reagim i shpejtë" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: styles$o.feedbackSection, children: [
        /* @__PURE__ */ jsx("div", { className: styles$o.feedbackHeader, children: /* @__PURE__ */ jsxs("h2", { children: [
          "Vlerësimet (",
          reviews.length,
          ")"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: styles$o.feedbackGrid, children: reviews.length > 0 ? reviews.map((r) => {
          var _a3, _b3;
          return /* @__PURE__ */ jsxs("div", { className: styles$o.modernReviewCard, children: [
            /* @__PURE__ */ jsx("div", { className: styles$o.reviewScore, children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("span", { className: i < r.rating ? styles$o.starFilled : styles$o.starEmpty, children: "★" }, i)) }),
            /* @__PURE__ */ jsxs("p", { className: styles$o.reviewText, children: [
              '"',
              r.comment,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$o.reviewerInfo, children: [
              /* @__PURE__ */ jsx("div", { className: styles$o.reviewerAvatar, children: ((_a3 = r.customerName) == null ? void 0 : _a3[0]) || "?" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: styles$o.reviewerName, children: r.customerName }),
                /* @__PURE__ */ jsx("p", { className: styles$o.reviewDate, children: r.createdAt ? new Date(
                  ((_b3 = r.createdAt) == null ? void 0 : _b3.toDate) ? r.createdAt.toDate() : r.createdAt
                ).toLocaleDateString("sq-AL") : "Sot" })
              ] })
            ] })
          ] }, r.id);
        }) : /* @__PURE__ */ jsx("p", { className: styles$o.noReviews, children: "Ende nuk ka vlerësime për këtë mjeshtër." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$o.mobileAction, children: /* @__PURE__ */ jsxs("div", { className: styles$o.mobileActionInner, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$o.mobilePricing, children: [
        /* @__PURE__ */ jsx("strong", { children: worker.startingPrice ? `${worker.startingPrice}€` : "Tarifa" }),
        /* @__PURE__ */ jsx("span", { children: "Fillon nga" })
      ] }),
      /* @__PURE__ */ jsx(
        WhatsAppButton,
        {
          workerId: worker.id,
          phoneNumber: worker.phoneNumber,
          workerName: worker.fullName
        }
      )
    ] }) })
  ] });
}
const register = "_register_i9h0f_11";
const form$4 = "_form_i9h0f_45";
const title$b = "_title_i9h0f_93";
const stepContainer = "_stepContainer_i9h0f_119";
const formGroup = "_formGroup_i9h0f_155";
const label$2 = "_label_i9h0f_169";
const input$2 = "_input_i9h0f_187";
const select = "_select_i9h0f_189";
const customCategoryInput = "_customCategoryInput_i9h0f_255";
const phoneContainer$1 = "_phoneContainer_i9h0f_281";
const phoneInput$1 = "_phoneInput_i9h0f_289";
const phoneButton = "_phoneButton_i9h0f_333";
const phoneDropdown = "_phoneDropdown_i9h0f_345";
const submitButton$2 = "_submitButton_i9h0f_369";
const buttonGroup$2 = "_buttonGroup_i9h0f_445";
const backButton = "_backButton_i9h0f_469";
const checkboxRow = "_checkboxRow_i9h0f_529";
const checkbox = "_checkbox_i9h0f_529";
const tosText = "_tosText_i9h0f_573";
const tosLink = "_tosLink_i9h0f_591";
const stepCounter = "_stepCounter_i9h0f_619";
const activeStep = "_activeStep_i9h0f_675";
const line = "_line_i9h0f_689";
const errorMessage$2 = "_errorMessage_i9h0f_707";
const errorIcon$1 = "_errorIcon_i9h0f_739";
const authSwitch = "_authSwitch_i9h0f_763";
const authLink = "_authLink_i9h0f_783";
const customCategoryBox = "_customCategoryBox_i9h0f_803";
const customCategoryTitle = "_customCategoryTitle_i9h0f_851";
const customCategoryDescription = "_customCategoryDescription_i9h0f_867";
const customCategoryActions = "_customCategoryActions_i9h0f_929";
const customCategoryCancel = "_customCategoryCancel_i9h0f_941";
const customCategoryContinue = "_customCategoryContinue_i9h0f_943";
const customCategoryHint = "_customCategoryHint_i9h0f_1047";
const editBtn = "_editBtn_i9h0f_1079";
const styles$n = {
  register,
  form: form$4,
  title: title$b,
  stepContainer,
  formGroup,
  label: label$2,
  input: input$2,
  select,
  customCategoryInput,
  phoneContainer: phoneContainer$1,
  phoneInput: phoneInput$1,
  phoneButton,
  phoneDropdown,
  submitButton: submitButton$2,
  buttonGroup: buttonGroup$2,
  backButton,
  checkboxRow,
  checkbox,
  tosText,
  tosLink,
  stepCounter,
  activeStep,
  line,
  errorMessage: errorMessage$2,
  errorIcon: errorIcon$1,
  authSwitch,
  authLink,
  customCategoryBox,
  customCategoryTitle,
  customCategoryDescription,
  customCategoryActions,
  customCategoryCancel,
  customCategoryContinue,
  customCategoryHint,
  editBtn
};
const cities$1 = [
  "Prishtinë",
  "Prizren",
  "Gjakovë",
  "Mitrovicë",
  "Pejë",
  "Ferizaj",
  "Gjilan"
];
const categories$2 = [
  "Të gjitha",
  "Instalues",
  "Elektricist",
  "Hidraulik",
  "Klima/AC",
  "Plastifikim",
  "Pastrim",
  "Kopshtar",
  "Mekanik",
  "Moler",
  "Murator",
  "Ndërtimtari",
  "Pllakaxhi",
  "Zdrukthëtar",
  "Kulme dhe Tjegulla",
  "Fasada dhe Izolim",
  "Parket dhe Laminat",
  "Dyer dhe Dritare",
  "Saldator",
  "Gips dhe Tavane",
  "Vullkanizer",
  "IT",
  "Tjetër"
];
function WorkerRegister() {
  const navigate = useNavigate();
  const [step2, setStep] = useState(1);
  const [error2, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    phoneNumber: "",
    skills: "",
    photo: null,
    acceptTerms: false
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);
  const handleInputChange = (e) => {
    const { name: name2, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name2]: type === "checkbox" ? checked : value
    }));
    if (name2 === "skills") {
      setIsCustom(value === "Tjetër");
    }
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      setError("Ju lutem pranoni Kushtet e Shërbimit për të vazhduar.");
      return;
    }
    if (step2 === 1) {
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 6) {
      setError("Ju lutem shkruani një numër telefoni të saktë.");
      return;
    }
    const isUsingCustomCategory = formData.skills === "Tjetër";
    const normalizedCustomCategory = customCategory.trim();
    if (!formData.skills) {
      setError("Ju lutem zgjidhni një kategori.");
      return;
    }
    if (isUsingCustomCategory && !normalizedCustomCategory) {
      setIsCustom(true);
      setError("Ju lutem shkruani profesionin që dëshironi të sugjeroni.");
      return;
    }
    let newlyCreatedUser = null;
    try {
      setIsPending(true);
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const user = userCredentials.user;
      newlyCreatedUser = user;
      const baseSlug = formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
      const initialSlug = `${baseSlug}-${user.uid.substring(0, 4)}`;
      const workerRef = doc(db, "workers", user.uid);
      const statsRef = doc(db, "metadata", "globalStats");
      const workerData = {
        uid: user.uid,
        fullName: formData.name.trim(),
        searchName: formData.name.trim().toLowerCase(),
        email: formData.email.trim(),
        phoneNumber: String(formData.phoneNumber || ""),
        slug: initialSlug,
        city: formData.city || "E panjohur",
        category: isUsingCustomCategory ? "Tjetër" : formData.skills,
        customCategory: isUsingCustomCategory ? normalizedCustomCategory : "",
        categoryStatus: isUsingCustomCategory ? "pending" : "approved",
        bio: "",
        profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "M")}&background=random`,
        portfolio: [],
        startingPrice: 0,
        experienceYears: 0,
        whatsappRequests: 0,
        avgRating: null,
        reviewCount: 0,
        lastReviewAt: null,
        isPro: false,
        isAvailable: true,
        isActive: true,
        isVerified: false,
        isSuspended: false,
        isFeatured: false,
        showProStar: false,
        quickResponse: false,
        lastFingerprint: "",
        createdAt: serverTimestamp()
      };
      const batch = writeBatch(db);
      batch.set(workerRef, workerData);
      if (isUsingCustomCategory) {
        const suggestionRef = doc(db, "categorySuggestions", user.uid);
        batch.set(suggestionRef, {
          workerId: user.uid,
          workerName: formData.name.trim(),
          workerEmail: formData.email.trim(),
          city: formData.city || "E panjohur",
          suggestedCategory: normalizedCustomCategory,
          status: "pending",
          createdAt: serverTimestamp(),
          reviewedAt: null,
          reviewedBy: null
        });
      }
      batch.update(statsRef, {
        workerCount: increment(1)
      });
      await batch.commit();
      navigate("/", { state: { modalOpen: true, name: formData.name } });
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Ky email është i regjistruar paraprakisht.");
          setStep(1);
          break;
        case "auth/invalid-email":
          setError("Ju lutem shkruani një email të saktë.");
          setStep(1);
          break;
        case "auth/weak-password":
          setError("Fjalëkalimi duhet të jetë më i fortë (min. 6 karaktere).");
          setStep(1);
          break;
        case "auth/user-not-found":
          setError("Nuk ekziston asnjë llogari me këtë email.");
          break;
        case "auth/wrong-password":
          setError("Fjalëkalimi është i gabuar.");
          break;
        case "auth/too-many-requests":
          setError("Shumë tentime të dështuara. Provo përsëri më vonë.");
          break;
        default:
          setError("Diçka shkoi keq. Ju lutem provoni përsëri.");
      }
    } finally {
      setIsPending(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$n.register, children: [
    /* @__PURE__ */ jsx("h1", { className: styles$n.title, children: "Regjistrohu si Mjeshtër" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: styles$n.form, children: [
      step2 === 1 && /* @__PURE__ */ jsxs("div", { className: styles$n.stepContainer, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$n.formGroup, children: [
          /* @__PURE__ */ jsx("label", { className: styles$n.label, children: "Email *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              name: "email",
              value: formData.email,
              onChange: handleInputChange,
              required: true,
              className: styles$n.input,
              placeholder: "email@shembull.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$n.formGroup, children: [
          /* @__PURE__ */ jsx("label", { className: styles$n.label, children: "Fjalëkalimi *" }),
          /* @__PURE__ */ jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleInputChange, required: true, className: styles$n.input, placeholder: "Fjalëkalimi" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: styles$n.formGroup, children: /* @__PURE__ */ jsxs("label", { className: styles$n.checkboxRow, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              name: "acceptTerms",
              checked: formData.acceptTerms,
              onChange: handleInputChange,
              className: styles$n.checkbox
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: styles$n.tosText, children: [
            "Pranoj ",
            /* @__PURE__ */ jsx(Link, { to: "/terms", className: styles$n.tosLink, onClick: (e) => e.stopPropagation(), children: "Kushtet e Shërbimit" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: styles$n.submitButton, children: "Vazhdo (Hapi Tjetër)" })
      ] }),
      step2 === 2 && /* @__PURE__ */ jsxs("div", { className: styles$n.stepContainer, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$n.formGroup, children: [
          /* @__PURE__ */ jsx("label", { className: styles$n.label, children: "Emri dhe Mbiemri *" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, required: true, className: styles$n.input, placeholder: "Shkruaj emrin tënd" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$n.formGroup, children: [
          /* @__PURE__ */ jsx("label", { className: styles$n.label, children: "Qyteti *" }),
          /* @__PURE__ */ jsxs("select", { name: "city", value: formData.city, onChange: handleInputChange, required: true, className: styles$n.select, children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Zgjidh qytetin" }),
            cities$1.map((city2) => /* @__PURE__ */ jsx("option", { value: city2, children: city2 }, city2))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$n.formGroup, children: [
          /* @__PURE__ */ jsx("label", { className: styles$n.label, children: "Numri i Telefonit (WhatsApp) *" }),
          /* @__PURE__ */ jsx(
            PhoneInput,
            {
              country: "xk",
              value: formData.phoneNumber,
              onChange: (value) => setFormData((prev) => ({ ...prev, phoneNumber: value })),
              containerClass: styles$n.phoneContainer,
              inputClass: styles$n.phoneInput,
              buttonClass: styles$n.phoneButton,
              dropdownClass: styles$n.phoneDropdown
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$n.formGroup, children: [
          /* @__PURE__ */ jsx("label", { className: styles$n.label, children: "Kategoria *" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "skills",
              value: formData.skills,
              onChange: handleInputChange,
              required: true,
              className: styles$n.select,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Zgjidh kategorinë" }),
                categories$2.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat === "Tjetër" && customCategory.trim() ? `Tjetër (${customCategory})` : cat }, cat))
              ]
            }
          ),
          formData.skills === "Tjetër" && customCategory.trim() !== "" && !isCustom && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsCustom(true),
              className: styles$n.editBtn,
              children: "Edit"
            }
          ),
          isCustom && /* @__PURE__ */ jsxs("div", { className: styles$n.customCategoryBox, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: styles$n.customCategoryTitle, children: "Profesion tjetër" }),
              /* @__PURE__ */ jsx("p", { className: styles$n.customCategoryDescription, children: "Nuk e gjete profesionin tënd në listë? Shkruaje më poshtë dhe ne do ta shqyrtojmë." })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: styles$n.customCategoryInput,
                placeholder: "p.sh. Montues i kuzhinave",
                value: customCategory,
                onChange: (e) => setCustomCategory(e.target.value),
                maxLength: 60,
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: styles$n.customCategoryHint, children: [
              /* @__PURE__ */ jsx("span", { children: "ℹ️" }),
              /* @__PURE__ */ jsx("span", { children: "Profesioni i sugjeruar do të shqyrtohet nga administratori." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$n.customCategoryActions, children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: styles$n.customCategoryCancel,
                  onClick: () => {
                    setIsCustom(false);
                    setCustomCategory("");
                    setFormData((prev) => ({
                      ...prev,
                      skills: ""
                    }));
                  },
                  children: "Anulo"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: styles$n.customCategoryContinue,
                  disabled: !customCategory.trim(),
                  onClick: () => {
                    setIsCustom(false);
                    setFormData((prev) => ({ ...prev, skills: "Tjetër" }));
                  },
                  children: "Vazhdo"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$n.buttonGroup, children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setStep(1), className: styles$n.backButton, children: "Kthehu" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isPending, className: styles$n.submitButton, children: !isPending ? "Përfundo Regjistrimin" : "Duke u regjistruar" })
        ] })
      ] }),
      error2 && /* @__PURE__ */ jsxs("div", { className: styles$n.errorMessage, children: [
        /* @__PURE__ */ jsx("span", { className: styles$n.errorIcon, children: "⚠️" }),
        " ",
        error2
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$n.stepCounter, children: [
        /* @__PURE__ */ jsx("span", { className: step2 === 1 ? styles$n.activeStep : "", children: "1" }),
        /* @__PURE__ */ jsx("div", { className: styles$n.line }),
        /* @__PURE__ */ jsx("span", { className: step2 === 2 ? styles$n.activeStep : "", children: "2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$n.authSwitch, children: [
        "Tashmë ke një llogari? ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: styles$n.authLink, children: "Hyr" })
      ] })
    ] })
  ] });
}
const loginWrap$1 = "_loginWrap_73ztz_1";
const card$4 = "_card_73ztz_35";
const resetMessage$1 = "_resetMessage_73ztz_57";
const title$a = "_title_73ztz_105";
const form$3 = "_form_73ztz_125";
const inputGroup$4 = "_inputGroup_73ztz_137";
const label$1 = "_label_73ztz_151";
const input$1 = "_input_73ztz_137";
const footerActions = "_footerActions_73ztz_207";
const resetRow = "_resetRow_73ztz_223";
const registerRow$1 = "_registerRow_73ztz_233";
const textBtn$1 = "_textBtn_73ztz_255";
const submitButton$1 = "_submitButton_73ztz_295";
const spinner$3 = "_spinner_73ztz_365";
const errorMessage$1 = "_errorMessage_73ztz_403";
const styles$m = {
  loginWrap: loginWrap$1,
  card: card$4,
  resetMessage: resetMessage$1,
  title: title$a,
  form: form$3,
  inputGroup: inputGroup$4,
  label: label$1,
  input: input$1,
  footerActions,
  resetRow,
  registerRow: registerRow$1,
  textBtn: textBtn$1,
  submitButton: submitButton$1,
  spinner: spinner$3,
  errorMessage: errorMessage$1
};
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error2, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [resetMessage2, setResetMessage] = useState("");
  const handleChange = (e) => {
    const { name: name2, value } = e.target;
    if (resetMessage2) setResetMessage("");
    setFormData((prev) => ({ ...prev, [name2]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email.includes("@")) {
      setError("Email-i duhet të përmbajë @");
      return;
    }
    if (formData.password.length < 6) {
      setError("Fjalëkalimi duhet të jetë së paku 6 karaktere");
      return;
    }
    setIsPending(true);
    try {
      const userCrendentials = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCrendentials.user;
      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("Ky email nuk ekziston.");
          break;
        case "auth/wrong-password":
          setError("Fjalëkalimi i gabuar.");
          break;
        default:
          setError("Email ose fjalëkalimi i gabuar.");
      }
    } finally {
      setIsPending(false);
    }
  };
  const handleResetPassword = async () => {
    var _a2;
    const email = (_a2 = formData.email) == null ? void 0 : _a2.trim();
    if (!email) {
      setError("Shkruaj një email.");
      return;
    }
    setError("");
    setResetMessage("");
    try {
      const functions2 = getFunctions(void 0, "us-central1");
      const requestPasswordReset = httpsCallable(
        functions2,
        "requestPasswordReset"
      );
      const result = await requestPasswordReset({ email });
      setResetMessage(result.data.message);
    } catch (error22) {
      console.error("Password reset request failed:", error22);
      setError(
        "Nuk mundëm ta përpunonim kërkesën. Provo përsëri më vonë."
      );
    }
  };
  return /* @__PURE__ */ jsx("div", { className: styles$m.loginWrap, children: /* @__PURE__ */ jsxs("div", { className: styles$m.card, children: [
    /* @__PURE__ */ jsx("h1", { className: styles$m.title, children: "Hyr në llogari" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: styles$m.form, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$m.inputGroup, children: [
        /* @__PURE__ */ jsx("label", { className: styles$m.label, htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "email",
            name: "email",
            type: "email",
            value: formData.email,
            onChange: handleChange,
            className: styles$m.input,
            placeholder: "email@shembull.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$m.inputGroup, children: [
        /* @__PURE__ */ jsx("label", { className: styles$m.label, htmlFor: "password", children: "Fjalëkalimi" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            name: "password",
            type: "password",
            value: formData.password,
            onChange: handleChange,
            className: styles$m.input,
            placeholder: "Fjalëkalimi",
            required: true
          }
        )
      ] }),
      resetMessage2 && /* @__PURE__ */ jsx("p", { className: styles$m.resetMessage, children: resetMessage2 }),
      /* @__PURE__ */ jsxs("div", { className: styles$m.footerActions, children: [
        /* @__PURE__ */ jsx("div", { className: styles$m.resetRow, children: /* @__PURE__ */ jsx("button", { type: "button", onClick: handleResetPassword, className: styles$m.textBtn, children: "Harrove fjalëkalimin?" }) }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: styles$m.submitButton, disabled: isPending, children: isPending ? /* @__PURE__ */ jsx("div", { className: styles$m.spinner }) : "Vazhdo" }),
        error2 && /* @__PURE__ */ jsx("div", { className: styles$m.errorMessage, children: error2 }),
        /* @__PURE__ */ jsxs("div", { className: styles$m.registerRow, children: [
          /* @__PURE__ */ jsx("span", { children: "Nuk ke llogari?" }),
          /* @__PURE__ */ jsx(Link, { to: "/register", children: "Krijo një të re" })
        ] })
      ] })
    ] })
  ] }) });
}
const dashboardContainer = "_dashboardContainer_7hnk3_27";
const sidebar = "_sidebar_7hnk3_49";
const brand = "_brand_7hnk3_67";
const logoSquare = "_logoSquare_7hnk3_81";
const profileBrief = "_profileBrief_7hnk3_123";
const avatarWrapper = "_avatarWrapper_7hnk3_135";
const statusBadge$1 = "_statusBadge_7hnk3_171";
const editOverlay = "_editOverlay_7hnk3_191";
const proBadge = "_proBadge_7hnk3_253";
const sideNav = "_sideNav_7hnk3_275";
const navItem = "_navItem_7hnk3_283";
const navItemActive = "_navItemActive_7hnk3_283";
const healthCard = "_healthCard_7hnk3_337";
const healthLabel = "_healthLabel_7hnk3_365";
const healthBar = "_healthBar_7hnk3_377";
const mainContent = "_mainContent_7hnk3_405";
const topHeader = "_topHeader_7hnk3_415";
const headerText = "_headerText_7hnk3_429";
const headerActions = "_headerActions_7hnk3_451";
const btnOnline = "_btnOnline_7hnk3_469";
const btnOffline = "_btnOffline_7hnk3_489";
const statsGrid = "_statsGrid_7hnk3_501";
const statBox = "_statBox_7hnk3_515";
const statIcon = "_statIcon_7hnk3_551";
const statVal = "_statVal_7hnk3_573";
const statTitle = "_statTitle_7hnk3_585";
const editorGrid = "_editorGrid_7hnk3_595";
const glassCard$1 = "_glassCard_7hnk3_607";
const cardHeader = "_cardHeader_7hnk3_623";
const inputRow = "_inputRow_7hnk3_643";
const field = "_field_7hnk3_657";
const phoneContainer = "_phoneContainer_7hnk3_719";
const phoneInput = "_phoneInput_7hnk3_727";
const linkBox = "_linkBox_7hnk3_749";
const copyGroup$1 = "_copyGroup_7hnk3_779";
const linkHint = "_linkHint_7hnk3_841";
const rightRail = "_rightRail_7hnk3_857";
const railSection = "_railSection_7hnk3_871";
const railHeader = "_railHeader_7hnk3_879";
const addBtn = "_addBtn_7hnk3_905";
const portfolioScroll = "_portfolioScroll_7hnk3_943";
const portThumb = "_portThumb_7hnk3_955";
const reqBtn = "_reqBtn_7hnk3_1027";
const sessionsList = "_sessionsList_7hnk3_1061";
const sessionItem$1 = "_sessionItem_7hnk3_1073";
const sessionInfo = "_sessionInfo_7hnk3_1107";
const sessionStatus = "_sessionStatus_7hnk3_1127";
const empty = "_empty_7hnk3_1145";
const stickyAction = "_stickyAction_7hnk3_1159";
const slideUp = "_slideUp_7hnk3_1";
const footerBtns = "_footerBtns_7hnk3_1213";
const btnSave = "_btnSave_7hnk3_1223";
const btnCancel = "_btnCancel_7hnk3_1265";
const modalContent$2 = "_modalContent_7hnk3_1297";
const avatarUploadArea = "_avatarUploadArea_7hnk3_1327";
const uploadBtn = "_uploadBtn_7hnk3_1341";
const deleteBtn$4 = "_deleteBtn_7hnk3_1375";
const avatarGridModal = "_avatarGridModal_7hnk3_1407";
const avatarOptionModal = "_avatarOptionModal_7hnk3_1421";
const selected = "_selected_7hnk3_1459";
const closeBtn = "_closeBtn_7hnk3_1469";
const avatarPreview = "_avatarPreview_7hnk3_1495";
const modalActions = "_modalActions_7hnk3_1523";
const reviewsModalList = "_reviewsModalList_7hnk3_1553";
const modalReviewCard = "_modalReviewCard_7hnk3_1565";
const stars = "_stars_7hnk3_1581";
const benefits = "_benefits_7hnk3_1611";
const primaryBtn$1 = "_primaryBtn_7hnk3_1653";
const secondaryBtn$1 = "_secondaryBtn_7hnk3_1689";
const errorIcon = "_errorIcon_7hnk3_1715";
const statsRow = "_statsRow_7hnk3_1727";
const status = "_status_7hnk3_171";
const fadeIn$1 = "_fadeIn_7hnk3_1";
const pending = "_pending_7hnk3_1771";
const success$2 = "_success_7hnk3_1783";
const error$2 = "_error_7hnk3_1715";
const verificationContainer$1 = "_verificationContainer_7hnk3_1809";
const statusDescription$1 = "_statusDescription_7hnk3_1835";
const successCard$2 = "_successCard_7hnk3_1851";
const bigCheckmark$1 = "_bigCheckmark_7hnk3_1865";
const successTitle$1 = "_successTitle_7hnk3_1889";
const pendingCard$1 = "_pendingCard_7hnk3_1905";
const bigClock$1 = "_bigClock_7hnk3_1919";
const rotate = "_rotate_7hnk3_1";
const pendingTitle$1 = "_pendingTitle_7hnk3_1931";
const loadingDots$1 = "_loadingDots_7hnk3_1943";
const dotsPulse = "_dotsPulse_7hnk3_1";
const errorCard$2 = "_errorCard_7hnk3_1979";
const bigErrorX$1 = "_bigErrorX_7hnk3_2001";
const errorTitle$2 = "_errorTitle_7hnk3_2011";
const errorText$2 = "_errorText_7hnk3_2025";
const retryBtn$1 = "_retryBtn_7hnk3_2039";
const supportTextSmall$1 = "_supportTextSmall_7hnk3_2073";
const idPlaceholder$1 = "_idPlaceholder_7hnk3_2087";
const pulseIcon$1 = "_pulseIcon_7hnk3_2121";
const imageFrame$2 = "_imageFrame_7hnk3_2133";
const idImagePreview$1 = "_idImagePreview_7hnk3_2147";
const btnSaveAction$1 = "_btnSaveAction_7hnk3_2163";
const animateFadeIn$1 = "_animateFadeIn_7hnk3_2275";
const animateShake$1 = "_animateShake_7hnk3_2277";
const shake = "_shake_7hnk3_1";
const animatePop$1 = "_animatePop_7hnk3_2279";
const popScale = "_popScale_7hnk3_1";
const usernameCon = "_usernameCon_7hnk3_2293";
const verifiedBadge$1 = "_verifiedBadge_7hnk3_2327";
const powerBtn = "_powerBtn_7hnk3_2353";
const powerIcon = "_powerIcon_7hnk3_2437";
const titleCon$1 = "_titleCon_7hnk3_2463";
const secondTitle$1 = "_secondTitle_7hnk3_2485";
const secondSubtitle$1 = "_secondSubtitle_7hnk3_2505";
const excuseBlock$1 = "_excuseBlock_7hnk3_2523";
const styles$l = {
  dashboardContainer,
  sidebar,
  brand,
  logoSquare,
  profileBrief,
  avatarWrapper,
  statusBadge: statusBadge$1,
  editOverlay,
  proBadge,
  sideNav,
  navItem,
  navItemActive,
  healthCard,
  healthLabel,
  healthBar,
  mainContent,
  topHeader,
  headerText,
  headerActions,
  btnOnline,
  btnOffline,
  statsGrid,
  statBox,
  statIcon,
  statVal,
  statTitle,
  editorGrid,
  glassCard: glassCard$1,
  cardHeader,
  inputRow,
  field,
  phoneContainer,
  phoneInput,
  linkBox,
  copyGroup: copyGroup$1,
  linkHint,
  rightRail,
  railSection,
  railHeader,
  addBtn,
  portfolioScroll,
  portThumb,
  reqBtn,
  sessionsList,
  sessionItem: sessionItem$1,
  sessionInfo,
  sessionStatus,
  empty,
  stickyAction,
  slideUp,
  footerBtns,
  btnSave,
  btnCancel,
  modalContent: modalContent$2,
  avatarUploadArea,
  uploadBtn,
  deleteBtn: deleteBtn$4,
  avatarGridModal,
  avatarOptionModal,
  selected,
  closeBtn,
  avatarPreview,
  modalActions,
  reviewsModalList,
  modalReviewCard,
  stars,
  benefits,
  primaryBtn: primaryBtn$1,
  secondaryBtn: secondaryBtn$1,
  errorIcon,
  statsRow,
  status,
  fadeIn: fadeIn$1,
  pending,
  success: success$2,
  error: error$2,
  verificationContainer: verificationContainer$1,
  statusDescription: statusDescription$1,
  successCard: successCard$2,
  bigCheckmark: bigCheckmark$1,
  successTitle: successTitle$1,
  pendingCard: pendingCard$1,
  bigClock: bigClock$1,
  rotate,
  pendingTitle: pendingTitle$1,
  loadingDots: loadingDots$1,
  dotsPulse,
  errorCard: errorCard$2,
  bigErrorX: bigErrorX$1,
  errorTitle: errorTitle$2,
  errorText: errorText$2,
  retryBtn: retryBtn$1,
  supportTextSmall: supportTextSmall$1,
  idPlaceholder: idPlaceholder$1,
  pulseIcon: pulseIcon$1,
  imageFrame: imageFrame$2,
  idImagePreview: idImagePreview$1,
  btnSaveAction: btnSaveAction$1,
  animateFadeIn: animateFadeIn$1,
  animateShake: animateShake$1,
  shake,
  animatePop: animatePop$1,
  popScale,
  usernameCon,
  verifiedBadge: verifiedBadge$1,
  powerBtn,
  powerIcon,
  titleCon: titleCon$1,
  secondTitle: secondTitle$1,
  secondSubtitle: secondSubtitle$1,
  excuseBlock: excuseBlock$1
};
const modalOverlay$1 = "_modalOverlay_pjksm_1";
const modalContent$1 = "_modalContent_pjksm_31";
const modalHeader$1 = "_modalHeader_pjksm_63";
const headerIcon = "_headerIcon_pjksm_73";
const sessionList = "_sessionList_pjksm_127";
const sessionItem = "_sessionItem_pjksm_147";
const clientInfo = "_clientInfo_pjksm_181";
const clientName = "_clientName_pjksm_191";
const clientPhone = "_clientPhone_pjksm_203";
const generateBtn = "_generateBtn_pjksm_215";
const closeModalBtn$1 = "_closeModalBtn_pjksm_259";
const loaderContainer$1 = "_loaderContainer_pjksm_295";
const miniSpinner = "_miniSpinner_pjksm_313";
const btnLoader = "_btnLoader_pjksm_331";
const emptyState = "_emptyState_pjksm_357";
const emptyIcon = "_emptyIcon_pjksm_373";
const styles$k = {
  modalOverlay: modalOverlay$1,
  modalContent: modalContent$1,
  modalHeader: modalHeader$1,
  headerIcon,
  sessionList,
  sessionItem,
  clientInfo,
  clientName,
  clientPhone,
  generateBtn,
  closeModalBtn: closeModalBtn$1,
  loaderContainer: loaderContainer$1,
  miniSpinner,
  btnLoader,
  emptyState,
  emptyIcon
};
const functions$1 = getFunctions(app, "us-central1");
function ReviewModal({ user, onClose, sessions }) {
  const [generatingId, setGeneratingId] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (sessions) {
      setLoading(false);
    }
  }, [sessions]);
  const handleCreateLink = async (sessionId, phone) => {
    setGeneratingId(sessionId);
    try {
      const createRequest = httpsCallable(functions$1, "createReviewRequest");
      const { data } = await createRequest({ sessionId });
      const cleanPhone = phone.replace(/\D/g, "");
      const message2 = encodeURIComponent(
        `Përshëndetje! Faleminderit që na kontaktuat. Mund të lini një vlerësim për punën tonë në këtë link: ${data.reviewUrl}`
      );
      window.location.href = `https://wa.me/${cleanPhone}?text=${message2}`, "_blank";
      onClose();
    } catch (err) {
      console.error("Error creating review request:", err);
      alert("Gabim: " + err.message);
    } finally {
      setGeneratingId(null);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: styles$k.modalOverlay, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: styles$k.modalContent, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("header", { className: styles$k.modalHeader, children: [
      /* @__PURE__ */ jsx("div", { className: styles$k.headerIcon, children: "⭐" }),
      /* @__PURE__ */ jsx("h2", { children: "Zgjidhni Klientin" }),
      /* @__PURE__ */ jsx("p", { children: "Kërko vlerësim nga kontaktet e fundit:" })
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: styles$k.loaderContainer, children: [
      /* @__PURE__ */ jsx("div", { className: styles$k.miniSpinner }),
      /* @__PURE__ */ jsx("span", { children: "Duke ngarkuar..." })
    ] }) : /* @__PURE__ */ jsx("div", { className: styles$k.sessionList, children: sessions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: styles$k.emptyState, children: [
      /* @__PURE__ */ jsx("span", { className: styles$k.emptyIcon, children: "💬" }),
      /* @__PURE__ */ jsx("p", { children: "Nuk u gjet asnjë kontakt i ri i disponueshëm." })
    ] }) : sessions.map((s) => /* @__PURE__ */ jsxs("div", { className: styles$k.sessionItem, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$k.clientInfo, children: [
        /* @__PURE__ */ jsx("span", { className: styles$k.clientName, children: s.customerName }),
        /* @__PURE__ */ jsx("span", { className: styles$k.clientPhone, children: s.customerPhone })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleCreateLink(s.id, s.customerPhone),
          disabled: generatingId !== null,
          className: styles$k.generateBtn,
          children: generatingId === s.id ? /* @__PURE__ */ jsx("div", { className: styles$k.btnLoader }) : "Dërgo"
        }
      )
    ] }, s.id)) }),
    /* @__PURE__ */ jsx("button", { onClick: onClose, className: styles$k.closeModalBtn, children: "Mbyll" })
  ] }) });
}
const loaderWrapper$1 = "_loaderWrapper_1ua1y_1";
const animationContainer = "_animationContainer_1ua1y_23";
const mainRing = "_mainRing_1ua1y_45";
const innerRing = "_innerRing_1ua1y_69";
const core = "_core_1ua1y_95";
const coreGlow = "_coreGlow_1ua1y_113";
const particle = "_particle_1ua1y_133";
const particleTwo = "_particleTwo_1ua1y_133";
const shimmerText = "_shimmerText_1ua1y_157";
const subText$3 = "_subText_1ua1y_183";
const progressBar = "_progressBar_1ua1y_199";
const progressFill = "_progressFill_1ua1y_217";
const styles$j = {
  loaderWrapper: loaderWrapper$1,
  animationContainer,
  mainRing,
  innerRing,
  core,
  coreGlow,
  particle,
  particleTwo,
  shimmerText,
  subText: subText$3,
  progressBar,
  progressFill
};
function Loading() {
  return /* @__PURE__ */ jsxs("div", { className: styles$j.loaderWrapper, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$j.animationContainer, children: [
      /* @__PURE__ */ jsx("div", { className: styles$j.mainRing }),
      /* @__PURE__ */ jsx("div", { className: styles$j.innerRing }),
      /* @__PURE__ */ jsx("div", { className: styles$j.core, children: /* @__PURE__ */ jsx("div", { className: styles$j.coreGlow }) }),
      /* @__PURE__ */ jsx("div", { className: styles$j.particle }),
      /* @__PURE__ */ jsx("div", { className: styles$j.particleTwo })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$j.textContainer, children: [
      /* @__PURE__ */ jsx("span", { className: styles$j.shimmerText, children: "MJESHTRI" }),
      /* @__PURE__ */ jsx("div", { className: styles$j.progressBar, children: /* @__PURE__ */ jsx("div", { className: styles$j.progressFill }) }),
      /* @__PURE__ */ jsx("span", { className: styles$j.subText, children: "Duke përgatitur ambientin..." })
    ] })
  ] });
}
const verificationContainer = "_verificationContainer_1hpcx_1";
const glassCard = "_glassCard_1hpcx_11";
const previewActions = "_previewActions_1hpcx_27";
const statusDescription = "_statusDescription_1hpcx_39";
const successCard$1 = "_successCard_1hpcx_55";
const bigCheckmark = "_bigCheckmark_1hpcx_69";
const successTitle = "_successTitle_1hpcx_93";
const pendingCard = "_pendingCard_1hpcx_109";
const bigClock = "_bigClock_1hpcx_123";
const pendingTitle = "_pendingTitle_1hpcx_135";
const loadingDots = "_loadingDots_1hpcx_147";
const errorCard$1 = "_errorCard_1hpcx_183";
const bigErrorX = "_bigErrorX_1hpcx_205";
const errorTitle$1 = "_errorTitle_1hpcx_215";
const errorText$1 = "_errorText_1hpcx_229";
const retryBtn = "_retryBtn_1hpcx_243";
const supportTextSmall = "_supportTextSmall_1hpcx_277";
const idPlaceholder = "_idPlaceholder_1hpcx_291";
const pulseIcon = "_pulseIcon_1hpcx_325";
const imageFrame$1 = "_imageFrame_1hpcx_337";
const idImagePreview = "_idImagePreview_1hpcx_351";
const primaryBtn = "_primaryBtn_1hpcx_367";
const btnSaveAction = "_btnSaveAction_1hpcx_391";
const secondaryBtn = "_secondaryBtn_1hpcx_421";
const animateFadeIn = "_animateFadeIn_1hpcx_499";
const animateShake = "_animateShake_1hpcx_501";
const animatePop = "_animatePop_1hpcx_503";
const titleCon = "_titleCon_1hpcx_599";
const secondTitle = "_secondTitle_1hpcx_621";
const secondSubtitle = "_secondSubtitle_1hpcx_641";
const excuseBlock = "_excuseBlock_1hpcx_659";
const styles$i = {
  verificationContainer,
  glassCard,
  previewActions,
  statusDescription,
  successCard: successCard$1,
  bigCheckmark,
  successTitle,
  pendingCard,
  bigClock,
  pendingTitle,
  loadingDots,
  errorCard: errorCard$1,
  bigErrorX,
  errorTitle: errorTitle$1,
  errorText: errorText$1,
  retryBtn,
  supportTextSmall,
  idPlaceholder,
  pulseIcon,
  imageFrame: imageFrame$1,
  idImagePreview,
  primaryBtn,
  btnSaveAction,
  secondaryBtn,
  animateFadeIn,
  animateShake,
  animatePop,
  titleCon,
  secondTitle,
  secondSubtitle,
  excuseBlock
};
const verifiesBadge = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAABF9JREFUeAHtm79v00AUx78XdQCkirAyhf4FqQobEmZgJWWgaiOkBkaWlokFiVZi6URYkJigCPUXAymMSNBKbAg1DEhMYAa6tgiJggQ53rMbpU3uHPsc+9woH8n5cT7H+T6/O7+7dwYGDBhgjUnpeJtFcrBFWc5B4K23TchZWELABmVZhMTWoTKJi1gRG0iZ9D1gUhZI7IuOcoHH3r6USd8AwhNfUOwp7O9LlXgGGJf5SJ1YWVbptRhQo4gpeR9huUpNKabXmPcBfGLuwPwrt0tuvUGfa/S+SW3Z7ag/5XV04cT9wy2siWpHORv8BKbpHA6d06H3PJW62MMoamIXBpgbYEqO06vOZeu0bdAfXPc6NvYS31hh2aX6FSyJ9f1jS1TmQO89FSyLRRgwBFPY+nrzFb1NYJYMBQPy9Ps1w2MjYS8OyAjmBsjhJLJCw+sLjDA3QIyT9hxhwwB9Qn8YwJIHFJAVpA0DiAz1ATEuRvRAiCPAHN3fJWaQJQSeUMc8r4xCAw8LQysE5ejPQZbhkJyNoQvJ2wg2gB+G3qWtGKedWaRG44pFGlfUdBXUBuCBCws/mqJVuKRlkTxirn2HzgDJB+E2WBYdenV3gQ1kgHMjEmdHenYtXFWhejQoaDzePmeXMvcmJEpj/udn7yQWXsWcvuQ5RwVqD1gSdTLCHCxxUDxz7TziIUmL5o6gD4SWxDwZoY6UaRfPfN5GHFwSP6/b2S0SvI4UUYn/vgPMPI3h/hrXbxJsgBSbgk78jUcC2zswI8D1m4QzbVlu0Y8VEYHSmMTty8DPPeDha4H1D/q6iYhn118WZ7pVCjcYatBdISI3LwHDx4DTp9QCmyQknqmEqZTYfMDw8cPfVUITFM/uH8q7wxmA01YRWXjZef6DghMVz4hwOYjuVuIsrqRxgQEskIW28/4LR3mHy3oqvonfCc4HVek2GuSsz1fEQGeEgyQivslfyho9F9p4JrgJRMvmKOHe/86a3s6JimeGgpuv3gDs+j2a99MZIXHxPpxA1TZh9aXpgeurONgcUhLfQtMUdPMBLL6ABOC4gDvAN58oSPqN9OCpshXRERYPJkSUFf3430W/wOsXGphV7wqiLEvkOhX6NI6jhi/aH8wti019tTD4y1B4hngaR2FaPEezwb9oEjTEqhGzxAi8qfIKskWV/lOVhvDfohwUZ4kMB0kOskCDrviquAIDzEeDMkOdJLd3Q+IkR41PmgAuDInjAVkygDGDFSIwJZchD5A2+oAGfiAr5GwYoE9IygB18hBe6+t4AxBBoXT0u4azP3hx9n9Ln6WKcUcyD4QqMo8/XgK1tVha0KYLQaMsluaBy6p40FHeCslLhxZL+w9buDAgXsrVXy+U9zJIYfCXwnd7PKZKVz5cHmJKXsAePpquFGfSf2QmOMtUJ/GjSJH0O8EGOGZ3FXvYlY3i+TjYeWhK9fyAoDm7sE2ph9i5DfpPh7XaOScwLIi3D3divA0YMMAW/wGpUogo9MyyfwAAAABJRU5ErkJggg==";
function VerificationSection({
  isVerified,
  isPending,
  verificationFailed,
  status: status2,
  idPreview,
  idFile,
  isVerifying,
  onIdSelect,
  onUpload,
  onRetake,
  // This function from Dashboard will now handle infinite resets
  setActiveTab
}) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragover") {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0] && e.dataTransfer.files.length > 0) {
      const droppedFiles = e.dataTransfer.files;
      onIdSelect({ target: { files: droppedFiles } });
    }
  };
  const isRejected = verificationFailed || status2.type === "rejected" && status2.message.includes("refuzua");
  return /* @__PURE__ */ jsxs("div", { className: `${styles$i.verificationContainer} ${styles$i.animateFadeIn}`, children: [
    /* @__PURE__ */ jsx("header", { className: styles$i.topHeader, children: /* @__PURE__ */ jsxs("div", { className: styles$i.headerText, children: [
      /* @__PURE__ */ jsx("h1", { children: "Verifikimi i Identitetit" }),
      /* @__PURE__ */ jsx("p", { children: "Siguria dhe besueshmëria janë prioritetet tona kryesore." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: styles$i.glassCard, children: /* @__PURE__ */ jsx("div", { className: styles$i.verificationUI, children: isVerified ? /* @__PURE__ */ jsxs("div", { className: `${styles$i.successCard} ${styles$i.animatePop}`, children: [
      /* @__PURE__ */ jsx("div", { className: styles$i.bigCheckmark, children: "✅" }),
      /* @__PURE__ */ jsx("h2", { className: styles$i.successTitle, children: "Profili u Verifikua!" }),
      /* @__PURE__ */ jsx("p", { className: styles$i.statusDescription, children: "Urime! Tani gëzoni besueshmëri të plotë dhe prioritet në kërkime." }),
      /* @__PURE__ */ jsx("button", { className: styles$i.primaryBtn, onClick: () => setActiveTab("main"), children: "Kthehu te Dashboard" })
    ] }) : isPending ? (
      /* 2. PENDING STATE */
      /* @__PURE__ */ jsxs("div", { className: styles$i.pendingCard, children: [
        /* @__PURE__ */ jsx("div", { className: styles$i.bigClock, children: "⏳" }),
        /* @__PURE__ */ jsx("h2", { className: styles$i.pendingTitle, children: "Duke u procesuar..." }),
        /* @__PURE__ */ jsx("p", { className: styles$i.statusDescription, children: "Dokumenti juaj po rishikohet nga stafi ynë. Zakonisht zgjat 24-48 orë." }),
        /* @__PURE__ */ jsxs("div", { className: styles$i.loadingDots, children: [
          /* @__PURE__ */ jsx("span", {}),
          /* @__PURE__ */ jsx("span", {}),
          /* @__PURE__ */ jsx("span", {})
        ] }),
        /* @__PURE__ */ jsx("button", { className: styles$i.secondaryBtn, onClick: () => setActiveTab("main"), children: "Dashboard" }),
        /* @__PURE__ */ jsxs("div", { className: styles$i.excuseBlock, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$i.titleCon, children: [
            /* @__PURE__ */ jsx("p", { className: styles$i.secondTitle, children: "Pse duhet ta bëj këtë?" }),
            /* @__PURE__ */ jsx("img", { src: verifiesBadge, alt: "verifiedbadge" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: styles$i.secondSubtitle, children: "Duke verifikuar identitetin, ju shtoni shansat për të fituar besimin e klientëve duke shfaqur ikonën ‘I verifikuar’ në profilin tënd. Informatat sensitive largohen nga databaza e platformës pasi që të verfikoheni nga ana jonë." })
        ] })
      ] })
    ) : isRejected ? (
      /* 3. ERROR / REJECTED STATE (STANDALONE) */
      /* @__PURE__ */ jsxs("div", { className: `${styles$i.errorCard} ${styles$i.animateShake}`, children: [
        /* @__PURE__ */ jsx("div", { className: styles$i.bigErrorX, children: "❌" }),
        /* @__PURE__ */ jsx("h3", { className: styles$i.errorTitle, children: "Verifikimi u Refuzua" }),
        /* @__PURE__ */ jsx("p", { className: styles$i.errorText, children: status2.message || "Dokumenti nuk i plotësonte kushtet (i paqartë ose i pavlefshëm). Ju lutem provoni përsëri." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: styles$i.retryBtn,
            onClick: onRetake,
            children: "Provo përsëri"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: styles$i.supportTextSmall, children: "Ndihmë? support@mjeshtri.ks" })
      ] })
    ) : (
      /* 4. INITIAL UPLOAD FORM */
      /* @__PURE__ */ jsxs("div", { className: styles$i.uploadWrapper + " " + styles$i.animateFadeIn, children: [
        /* @__PURE__ */ jsx("div", { className: styles$i.idSection, children: idPreview ? /* @__PURE__ */ jsxs("div", { className: styles$i.previewContainer, children: [
          /* @__PURE__ */ jsx("div", { className: styles$i.imageFrame, children: /* @__PURE__ */ jsx("img", { src: idPreview, alt: "ID Preview", className: styles$i.idImagePreview }) }),
          /* @__PURE__ */ jsxs("div", { className: styles$i.previewActions, children: [
            /* @__PURE__ */ jsx("button", { className: styles$i.secondaryBtn, onClick: onRetake, children: "🔄 Ndrysho foton" }),
            idFile && /* @__PURE__ */ jsx("button", { className: styles$i.btnSaveAction, onClick: onUpload, disabled: isVerifying, children: isVerifying ? "Duke u dërguar..." : "Dërgo Dokumentin" })
          ] })
        ] }) : /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: "id-upload",
            className: `${styles$i.idPlaceholder} ${isDragging ? styles$i.dragActive : ""}`,
            onDragOver: handleDrag,
            onDragLeave: handleDrag,
            onDrop: handleDrop,
            children: [
              /* @__PURE__ */ jsx("div", { className: styles$i.pulseIcon, children: isDragging ? "📥" : "🪪" }),
              /* @__PURE__ */ jsx("p", { children: isDragging ? "Lëshoje këtu..." : "Kliko ose Tërhiq Letërnjoftimin" }),
              /* @__PURE__ */ jsx("input", { type: "file", id: "id-upload", hidden: true, onChange: onIdSelect, accept: "image/*" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: styles$i.excuseBlock, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$i.titleCon, children: [
            /* @__PURE__ */ jsx("p", { className: styles$i.secondTitle, children: "Pse duhet ta bëj këtë?" }),
            /* @__PURE__ */ jsx("img", { src: verifiesBadge, alt: "verifiedbadge" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: styles$i.secondSubtitle, children: "Duke verifikuar identitetin, ju shtoni shansat për të fituar besimin e klientëve duke shfaqur ikonën ‘I verifikuar’ në profilin tënd. Informatat sensitive largohen nga databaza e platformës pasi që të verfikoheni nga ana jonë." })
        ] })
      ] })
    ) }) })
  ] });
}
const wrapper$1 = "_wrapper_1mtby_1";
const proSettings = "_proSettings_1mtby_11";
const overlay = "_overlay_1mtby_27";
const message = "_message_1mtby_59";
const upgradeBtn = "_upgradeBtn_1mtby_81";
const section$1 = "_section_1mtby_117";
const copyGroup = "_copyGroup_1mtby_131";
const settingsList = "_settingsList_1mtby_203";
const slider = "_slider_1mtby_255";
const proBadgeContainer = "_proBadgeContainer_1mtby_303";
const starIcon$1 = "_starIcon_1mtby_321";
const starPro = "_starPro_1mtby_323";
const analyticsSection = "_analyticsSection_1mtby_329";
const analyticsHeader = "_analyticsHeader_1mtby_345";
const headerTitle = "_headerTitle_1mtby_359";
const pulseContainer = "_pulseContainer_1mtby_365";
const pulseDot = "_pulseDot_1mtby_375";
const liveText = "_liveText_1mtby_397";
const visualTable = "_visualTable_1mtby_403";
const tableRow = "_tableRow_1mtby_407";
const rowInfo = "_rowInfo_1mtby_425";
const iconBox = "_iconBox_1mtby_429";
const rowText = "_rowText_1mtby_443";
const sparkline = "_sparkline_1mtby_449";
const percentageValue = "_percentageValue_1mtby_465";
const statusBadge = "_statusBadge_1mtby_467";
const blueRow = "_blueRow_1mtby_479";
const orangeRow = "_orangeRow_1mtby_481";
const greenRow = "_greenRow_1mtby_483";
const purpleRow = "_purpleRow_1mtby_485";
const proFooter = "_proFooter_1mtby_489";
const styles$h = {
  wrapper: wrapper$1,
  proSettings,
  overlay,
  message,
  upgradeBtn,
  section: section$1,
  copyGroup,
  settingsList,
  "switch": "_switch_1mtby_235",
  slider,
  proBadgeContainer,
  starIcon: starIcon$1,
  starPro,
  analyticsSection,
  analyticsHeader,
  headerTitle,
  pulseContainer,
  pulseDot,
  liveText,
  visualTable,
  tableRow,
  rowInfo,
  iconBox,
  rowText,
  sparkline,
  percentageValue,
  statusBadge,
  blueRow,
  orangeRow,
  greenRow,
  purpleRow,
  proFooter
};
const StarIcon = () => /* @__PURE__ */ jsx("div", { className: styles$h.proBadgeContainer, title: "Anëtar PRO", children: /* @__PURE__ */ jsx("span", { className: styles$h.starIcon, children: "★" }) });
const Pro = ({ isPro, onUpgradeClick, form: form2, lastReviewDate, handleChange, onStatus, link }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles$h.wrapper, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$h.proSettings, children: [
      /* @__PURE__ */ jsx("div", { className: styles$h.cardHeader, children: /* @__PURE__ */ jsx("h3", { children: "Settings PRO" }) }),
      /* @__PURE__ */ jsx("section", { className: styles$h.section, children: /* @__PURE__ */ jsxs("div", { className: styles$h.linkBox, children: [
        /* @__PURE__ */ jsx("label", { className: styles$h.title, children: "Linku juaj publik" }),
        /* @__PURE__ */ jsxs("div", { className: styles$h.copyGroup, children: [
          /* @__PURE__ */ jsx("input", { readOnly: true, value: link }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                navigator.clipboard.writeText(link);
                onStatus({ message: "Linku u kopjua!", type: "success" });
              },
              children: "Kopjo"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: styles$h.section, children: [
        /* @__PURE__ */ jsx("p", { className: styles$h.title, children: "Cilësimet e Profilit PRO" }),
        /* @__PURE__ */ jsxs("ul", { className: styles$h.settingsList, children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { children: "Në faqen kryesore të GjejNjerin" }),
            /* @__PURE__ */ jsxs("label", { className: styles$h.switch, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form2.isFeatured,
                  onChange: (e) => handleChange("isFeatured", e.target.checked),
                  disabled: !form2.isAvailable
                }
              ),
              /* @__PURE__ */ jsx("span", { className: styles$h.slider })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("span", { children: 'Aktivizo distinktivin "Reagim i shpejtë"' }),
            /* @__PURE__ */ jsxs("label", { className: styles$h.switch, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form2.quickResponse || false,
                  onChange: (e) => handleChange("quickResponse", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: styles$h.slider })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("span", { className: styles$h.starPro, children: [
              "Shfaq PRO ",
              /* @__PURE__ */ jsx(StarIcon, {}),
              " në profil"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: styles$h.switch, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form2.showProStar,
                  onChange: (e) => handleChange("showProStar", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: styles$h.slider })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: styles$h.analyticsSection, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$h.analyticsHeader, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$h.headerTitle, children: [
            /* @__PURE__ */ jsx("h4", { children: "Paneli i Performancës" }),
            /* @__PURE__ */ jsx("p", { children: "Statistikat tuaja PRO" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$h.pulseContainer, children: [
            /* @__PURE__ */ jsx("span", { className: styles$h.pulseDot }),
            /* @__PURE__ */ jsx("span", { className: styles$h.liveText, children: "LIVE DATA" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$h.visualTable, children: [
          /* @__PURE__ */ jsxs("div", { className: `${styles$h.tableRow} ${styles$h.blueRow}`, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$h.rowInfo, children: [
              /* @__PURE__ */ jsx("div", { className: styles$h.iconBox, children: "📊" }),
              /* @__PURE__ */ jsxs("div", { className: styles$h.rowText, children: [
                /* @__PURE__ */ jsx("strong", { children: "Interesimi total" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  form2.whatsappRequests || 0,
                  " Klikime në WhatsApp"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$h.rowChart, children: /* @__PURE__ */ jsx("svg", { className: styles$h.sparkline, viewBox: "0 0 100 30", children: /* @__PURE__ */ jsx("path", { d: "M0 25 Q 25 5, 50 20 T 100 5", fill: "none", stroke: "#4c6ef5", strokeWidth: "2.5", strokeLinecap: "round" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `${styles$h.tableRow} ${styles$h.orangeRow}`, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$h.rowInfo, children: [
              /* @__PURE__ */ jsx("div", { className: styles$h.iconBox, children: "⭐" }),
              /* @__PURE__ */ jsxs("div", { className: styles$h.rowText, children: [
                /* @__PURE__ */ jsx("strong", { children: "Reputacioni" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  form2.avgRating || "0",
                  " Rating / ",
                  form2.reviewCount || 0,
                  " Reviews"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$h.rowChart, children: /* @__PURE__ */ jsx("svg", { className: styles$h.sparkline, viewBox: "0 0 100 30", children: /* @__PURE__ */ jsx("path", { d: "M0 20 L 20 10 L 40 25 L 60 5 L 80 15 L 100 10", fill: "none", stroke: "#fab005", strokeWidth: "2.5", strokeLinecap: "round" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `${styles$h.tableRow} ${styles$h.greenRow}`, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$h.rowInfo, children: [
              /* @__PURE__ */ jsx("div", { className: styles$h.iconBox, children: "🎯" }),
              /* @__PURE__ */ jsxs("div", { className: styles$h.rowText, children: [
                /* @__PURE__ */ jsx("strong", { children: "Shkalla e Konvertimit" }),
                /* @__PURE__ */ jsx("p", { children: "Besueshmëria e profilit" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$h.percentageValue, children: [
              form2.whatsappRequests > 0 ? (form2.reviewCount / form2.whatsappRequests * 100).toFixed(1) : "0",
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `${styles$h.tableRow} ${styles$h.purpleRow}`, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$h.rowInfo, children: [
              /* @__PURE__ */ jsx("div", { className: styles$h.iconBox, children: "🕒" }),
              /* @__PURE__ */ jsxs("div", { className: styles$h.rowText, children: [
                /* @__PURE__ */ jsx("strong", { children: "Aktiviteti i fundit" }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "Vlerësimi i fundit: ",
                  lastReviewDate ? lastReviewDate.toDate ? lastReviewDate.toDate().toLocaleDateString("sq-AL") : new Date(lastReviewDate).toLocaleDateString("sq-AL") : "Asnjë vlerësim"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$h.statusBadge, children: lastReviewDate ? "AKTIV" : "I RI" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: styles$h.proFooter, children: /* @__PURE__ */ jsx("p", { children: "Këto të dhëna janë private dhe të dukshme vetëm për ju." }) })
      ] })
    ] }),
    !isPro && /* @__PURE__ */ jsx("div", { className: styles$h.overlay, children: /* @__PURE__ */ jsxs("div", { className: styles$h.message, children: [
      /* @__PURE__ */ jsx("p", { children: "Bëhu PRO për të aktivizuar këtë seksion" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: styles$h.upgradeBtn,
          onClick: onUpgradeClick,
          children: "Bëhu PRO"
        }
      )
    ] }) })
  ] });
};
const functions = getFunctions();
const DEFAULT_AVATARS = [
  "/avatars/Avatar-1.jpg",
  "/avatars/Avatar-2.jpg",
  "/avatars/Avatar-3.jpg",
  "/avatars/Avatar-4.jpg",
  "/avatars/Avatar-5.jpg",
  "/avatars/Avatar-6.jpg",
  "/avatars/Avatar-7.jpg",
  "/avatars/Avatar-8.jpg"
];
const cities = [
  "Prishtinë",
  "Prizren",
  "Gjakovë",
  "Mitrovicë",
  "Pejë",
  "Ferizaj",
  "Gjilan"
];
const categories$1 = [
  "Të gjitha",
  "Instalues",
  "Elektricist",
  "Hidraulik",
  "Klima/AC",
  "Plastifikim",
  "Pastrim",
  "Kopshtar",
  "Mekanik",
  "Moler",
  "Murator",
  "Ndërtimtari",
  "Pllakaxhi",
  "Zdrukthëtar",
  "Kulme dhe Tjegulla",
  "Fasada dhe Izolim",
  "Parket dhe Laminat",
  "Dyer dhe Dritare",
  "Saldator",
  "Gips dhe Tavane",
  "Vullkanizer",
  "IT",
  "Tjetër"
];
function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status2, setStatus] = useState({ message: "", type: "" });
  const [form2, setForm] = useState({
    name: "",
    category: "",
    yearsExperience: "",
    hourlyRate: "",
    phoneNumber: "",
    bio: "",
    isPro: false,
    customCategory: "",
    isAvailable: true,
    profileUrl: "",
    portfolio: [],
    slug: "",
    isFeatured: false,
    showProStar: false,
    quickResponse: false,
    reviewCount: 0,
    avgRating: null,
    whatsappRequests: 0
  });
  const [profileFile, setProfileFile] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [whatsappRequests, setWhatsappRequests] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeTab2, setActiveTab] = useState("main");
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    review: false,
    pro: false,
    error: false,
    health: false,
    reviewsList: false,
    avatar: false
  });
  const [isPending, setIsPending] = useState(false);
  useRef();
  const initialDataRef = useRef(null);
  const MAX_PORTFOLIO_IMG_NOPRO = 3;
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      var _a2;
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "workers", u.uid);
        const snap = await getDoc(docRef);
        let isActuallyVerified = false;
        if (snap.exists()) {
          const data = snap.data();
          setWhatsappRequests(data.whatsappRequests || 0);
          isActuallyVerified = !!data.isVerified;
          const initialForm = {
            name: data.fullName || "",
            category: data.categoryStatus === "approved" && ((_a2 = data.customCategory) == null ? void 0 : _a2.trim()) ? data.customCategory.trim() : data.category || "",
            customCategory: data.customCategory || "",
            yearsExperience: data.experienceYears || 0,
            phoneNumber: data.phoneNumber || "",
            hourlyRate: data.startingPrice ?? data.hourlyRate ?? "",
            bio: data.bio || "",
            city: data.city || "",
            isPro: !!data.isPro,
            profileUrl: data.profilePic || "",
            portfolio: data.portfolio || [],
            slug: data.slug || "",
            isAvailable: data.isAvailable !== false,
            isVerified: isActuallyVerified,
            isFeatured: data.isFeatured,
            showProStar: data.showProStar,
            quickResponse: data.quickResponse,
            reviewCount: data.reviewCount,
            avgRating: data.avgRating,
            whatsappRequests: data.whatsappRequests
          };
          setForm(initialForm);
          initialDataRef.current = initialForm;
        }
        if (!isActuallyVerified) {
          const pendingRef = doc(db, "verificationRequests", u.uid);
          const pendingSnap = await getDoc(pendingRef);
          if (pendingSnap.exists()) {
            const status22 = pendingSnap.data().status;
            if (status22 === "pending") {
              setIsPending(true);
            } else if (status22 === "rejected") {
              setIsPending(false);
              setVerificationFailed(true);
            }
          }
        }
        const q = query(collection(db, "reviews"), where("workerId", "==", u.uid), orderBy("createdAt", "desc"));
        const sessionQuery = query(collection(db, "contactSessions"), where("workerId", "==", u.uid), where("usedForReview", "==", false), orderBy("createdAt", "desc"));
        const [sessionSnap, revSnap] = await Promise.all([getDocs(sessionQuery), getDocs(q)]);
        setSessions(sessionSnap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() })));
        setReviews(revSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);
  const handlePhoneNum = (value) => {
    if (value !== form2.phoneNumber) setIsDirty(true);
    setForm((p) => ({ ...p, phoneNumber: value }));
  };
  const handleChange = (e) => {
    const { name: name2, value, type, checked } = e.target;
    setIsDirty(true);
    setForm((p) => ({ ...p, [name2]: type === "checkbox" ? checked : value }));
  };
  const handleProfileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ message: "Foto është mbi 10MB", type: "error" });
      return;
    }
    setIsModalOpen((p) => ({
      ...p,
      avatar: false
    }));
    setProfileFile(file);
    setIsDirty(true);
  };
  const handleSelectDefaultAvatar = (url) => {
    setProfileFile(url);
    setForm((prev) => ({ ...prev, profileUrl: url }));
    setIsDirty(true);
  };
  const handleDeleteProfile = () => {
    setProfileFile(null);
    setForm((prev) => ({ ...prev, profileUrl: "" }));
    setIsDirty(true);
  };
  const handlePortfolioSelect = (e) => {
    var _a2;
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    const validSizeFiles = selectedFiles.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validSizeFiles.length < selectedFiles.length) {
      setStatus({
        message: "Disa foto u hoqën sepse ishin mbi 10MB.",
        type: "error"
      });
    }
    if (validSizeFiles.length === 0) return;
    const currentCount = portfolioFiles.length + (((_a2 = form2.portfolio) == null ? void 0 : _a2.length) || 0);
    const totalAfter = currentCount + validSizeFiles.length;
    if (!form2.isPro && totalAfter > MAX_PORTFOLIO_IMG_NOPRO) {
      setIsModalOpen((p) => ({ ...p, pro: true }));
      const spaceLeft = MAX_PORTFOLIO_IMG_NOPRO - currentCount;
      if (spaceLeft > 0) {
        const allowedFiles = validSizeFiles.slice(0, spaceLeft);
        setPortfolioFiles((prev) => [...prev, ...allowedFiles]);
        setIsDirty(true);
      }
      return;
    }
    setPortfolioFiles((prev) => [...prev, ...validSizeFiles]);
    setIsDirty(true);
  };
  const handleDeleteExistingPortfolio = (url) => {
    setIsDirty(true);
    setForm((p) => ({ ...p, portfolio: p.portfolio.filter((u) => u !== url) }));
  };
  const handleDeleteNewPortfolio = (i) => setPortfolioFiles((p) => p.filter((_, idx) => idx !== i));
  const handleProfileView = () => {
    if (!user) return;
    navigate(`/worker/${user.uid}`, {
      state: {
        workerData: {
          ...form2,
          fullName: form2.name,
          profilePic: profileFile ? URL.createObjectURL(profileFile) : form2.profileUrl,
          experienceYears: form2.yearsExperience
        }
      }
    });
  };
  const handleInstantSave = async (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    try {
      const docRef = doc(db, "workers", user.uid);
      await updateDoc(docRef, {
        [key]: value,
        updatedAt: serverTimestamp()
      });
      setStatus({ message: "Ndryshimi u ruajt!", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 2e3);
    } catch (err) {
      console.error("Instant save failed:", err);
      setForm((prev) => ({ ...prev, [key]: !value }));
      setStatus({ message: "Gabim gjatë ruajtjes!", type: "error" });
    }
  };
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user) return;
    if (!form2.phoneNumber || form2.phoneNumber.length < 8) {
      setIsModalOpen((p) => ({ ...p, error: true }));
      return;
    }
    const finalCustomCategory = (form2.customCategory || "").trim();
    if (form2.category === "Tjetër" && !finalCustomCategory) {
      setStatus({
        message: "Shkruaj profesionin tënd.",
        type: "error"
      });
      return;
    }
    setSaving(true);
    setStatus({ message: "Duke u ruajtur...", type: "pending" });
    try {
      const updates = {
        fullName: form2.name,
        searchName: form2.name.toLowerCase().trim(),
        phoneNumber: form2.phoneNumber,
        category: form2.category,
        customCategory: form2.category === "Tjetër" ? finalCustomCategory : "",
        categoryStatus: form2.category === "Tjetër" ? "pending" : "approved",
        experienceYears: form2.yearsExperience,
        startingPrice: Number(form2.hourlyRate) || 0,
        bio: form2.bio,
        city: form2.city,
        updatedAt: serverTimestamp(),
        portfolio: portfolioFiles,
        profilePic: form2.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form2.name)}&background=00ff85&color=fff`
      };
      if (form2.isPro) {
        const baseSlug = form2.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
        updates.slug = `${baseSlug}-${user.uid.substring(0, 4)}`;
      }
      let profileUrl = form2.profileUrl;
      let newPortfolioUrls = [];
      if (profileFile) {
        if (profileFile instanceof File) {
          const profileOptions = {
            maxSizeMB: 0.5,
            // Target 500KB
            maxWidthOrHeight: 512,
            // Avatars don't need to be huge
            useWebWorker: true
          };
          const compressed = await imageCompression(profileFile, profileOptions);
          const path = `workers/${user.uid}/profile-${Date.now()}`;
          profileUrl = await uploadFile(path, compressed);
          updates.profilePic = profileUrl;
        } else {
          updates.profilePic = profileFile;
        }
        setProfileFile(null);
      }
      if (portfolioFiles.length > 0) {
        const portfolioOptions = {
          maxSizeMB: 0.8,
          // Target 800KB
          maxWidthOrHeight: 1280,
          // HD Resolution
          useWebWorker: true
        };
        const uploadPromises = portfolioFiles.map(async (file) => {
          const compressed = await imageCompression(file, portfolioOptions);
          const path = `workers/${user.uid}/portfolio/${Date.now()}-${file.name}`;
          return uploadFile(path, compressed);
        });
        newPortfolioUrls = await Promise.all(uploadPromises);
        updates.portfolio = arrayUnion(...newPortfolioUrls);
        setPortfolioFiles([]);
      }
      await updateDoc(doc(db, "workers", user.uid), updates);
      if (form2.category === "Tjetër") {
        const suggestionRef = doc(db, "categorySuggestions", user.uid);
        const suggestionSnap = await getDoc(suggestionRef);
        const existingSuggestion = suggestionSnap.exists() ? suggestionSnap.data() : null;
        if (!existingSuggestion || existingSuggestion.suggestedCategory !== finalCustomCategory || existingSuggestion.status === "declined") {
          await setDoc(suggestionRef, {
            workerId: user.uid,
            workerName: form2.name,
            workerEmail: user.email || "",
            city: form2.city || "",
            suggestedCategory: finalCustomCategory,
            status: "pending",
            createdAt: (existingSuggestion == null ? void 0 : existingSuggestion.createdAt) || serverTimestamp(),
            reviewedAt: null,
            reviewedBy: null
          }, { merge: true });
        }
      }
      setIsDirty(false);
      setStatus({ message: "U ruajt me sukses!", type: "success" });
      setForm((prev) => ({
        ...prev,
        profileUrl,
        portfolio: [...prev.portfolio || [], ...newPortfolioUrls],
        slug: updates.slug || prev.slug
      }));
    } catch (err) {
      console.error(err);
      setStatus({ message: "Gabim gjatë ruajtjes.", type: "error" });
    } finally {
      setSaving(false);
    }
  };
  const uploadFile = async (path, file) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };
  const disableAccount = async () => {
    if (!user) return;
    const newStatus = !form2.isAvailable;
    await updateDoc(doc(db, "workers", user.uid), { isAvailable: newStatus });
    setForm((p) => ({ ...p, isAvailable: newStatus }));
  };
  const getHealthStatus = () => {
    const clicks = whatsappRequests || 0;
    const revs = reviews.length || 0;
    if (revs > clicks + 1 && revs > 3) return { label: "ANOMALI", color: "#ff4d4d", score: "Kritik", desc: "Shumë vlerësime pa klikime reale." };
    const ratio = revs / (clicks + 1);
    if (ratio > 0.7 && revs > 5) return { label: "ELITARE", color: "#00ff85", score: "Normal", desc: "Shkallë konvertimi e lartë!" };
    return { label: "I RREGULLT", color: "#00ff85", score: "Normal", desc: "Profili juaj është në rregull." };
  };
  const health = getHealthStatus();
  const baseUrl = window.location.origin;
  const personalLink = form2.slug ? `${baseUrl}/${form2.slug}` : `${baseUrl}/worker/${user == null ? void 0 : user.uid}`;
  const handleIdSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdFile(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };
  const handleUploadVerification = async () => {
    if (!idFile) return setStatus({ message: "Ju lutem zgjidhni një dokument.", type: "error" });
    setIsVerifying(true);
    try {
      const storageRef = ref(storage, `verifications/${user.uid}/${Date.now()}_id`);
      await uploadBytes(storageRef, idFile);
      const requestRef = doc(db, "verificationRequests", user.uid);
      await setDoc(requestRef, {
        uid: user.uid,
        email: user.email,
        workerName: form2.name,
        rejectionCount: increment(0),
        status: "pending",
        createdAt: serverTimestamp(),
        searchName: form2.name.toLowerCase(),
        storagePath: storageRef.fullPath
      }, { merge: true });
      setIsPending(true);
      setStatus({ message: "Dokumenti u dërgua me sukses! Do të shqyrtohet së shpejti.", type: "success" });
    } catch (err) {
      console.error(err);
      setStatus({ message: "Gabim gjatë dërgimit.", type: "error" });
    } finally {
      setIsVerifying(false);
    }
  };
  const handleRetake = () => {
    setIdFile(null);
    setIdPreview(null);
    setVerificationFailed(false);
    setStatus({ type: "", message: "" });
    setActiveTab("verification");
  };
  const handleCancel = () => {
    if (initialDataRef.current) {
      setForm(initialDataRef.current);
      setProfileFile(null);
      setPortfolioFiles([]);
      setIsDirty(false);
      setStatus({ message: "", type: "" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (loading) return /* @__PURE__ */ jsx(Loading, {});
  return /* @__PURE__ */ jsxs("div", { className: styles$l.dashboardContainer, children: [
    /* @__PURE__ */ jsxs("aside", { className: styles$l.sidebar, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$l.brand, children: [
        /* @__PURE__ */ jsx("div", { className: styles$l.logoSquare, children: "M" }),
        /* @__PURE__ */ jsxs("h2", { children: [
          "GjejNjerin",
          /* @__PURE__ */ jsx("span", {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.profileBrief, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$l.avatarWrapper, onClick: () => setIsModalOpen((p) => ({ ...p, avatar: true })), children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: profileFile instanceof File ? URL.createObjectURL(profileFile) : form2.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form2.name || "M")}&background=00ff85&color=fff`,
              alt: "Avatar"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: styles$l.statusBadge, style: { backgroundColor: form2.isAvailable ? "#00ff85" : "#ff4d4d" } }),
          /* @__PURE__ */ jsx("div", { className: styles$l.editOverlay, children: "✎" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$l.usernameCon, children: [
          /* @__PURE__ */ jsxs("h3", { children: [
            form2.name || "Emri juaj",
            " "
          ] }),
          form2.isVerified && /* @__PURE__ */ jsx(
            CheckCircle2,
            {
              size: 25,
              className: styles$l.verifiedBadge,
              fill: "#0095f6",
              color: "#fff"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { children: form2.category || "Kategoria" }),
        form2.isPro && /* @__PURE__ */ jsx("span", { className: styles$l.proBadge, children: "PRO" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: styles$l.sideNav, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: activeTab2 === "main" ? styles$l.navItemActive : styles$l.navItem,
            onClick: () => setActiveTab("main"),
            children: "📊 Dashboard"
          }
        ),
        /* @__PURE__ */ jsx("button", { className: styles$l.navItem, onClick: handleProfileView, children: "👁 Shiko Profilin" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: activeTab2 === "verification" ? styles$l.navItemActive : styles$l.navItem,
            onClick: () => setActiveTab("verification"),
            children: form2.isVerified ? "✅ I Verifikuar" : "🛡️ Verifikohu"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab("pro"),
            className: activeTab2 === "pro" ? styles$l.navItemActive : styles$l.navItem,
            children: form2.isPro ? "🌟Cilësimet PRO" : "🚀 Bëhu PRO"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.healthCard, onClick: () => setIsModalOpen((p) => ({ ...p, health: true })), children: [
        /* @__PURE__ */ jsx("div", { className: styles$l.healthLabel, children: "Statusi i Integritetit" }),
        /* @__PURE__ */ jsx("div", { className: styles$l.healthBar, children: /* @__PURE__ */ jsx("div", { style: { width: reviews.length / (whatsappRequests + 1) * 100 + "%", backgroundColor: health.color } }) }),
        /* @__PURE__ */ jsx("span", { children: health.label })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: styles$l.mainContent, children: activeTab2 === "main" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("header", { className: styles$l.topHeader, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$l.headerText, children: [
          /* @__PURE__ */ jsxs("h1", { children: [
            "Mirësevini, ",
            form2.name.split(" ")[0] || "Mjeshtër",
            "!"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "Këtu mund të menaxhoni prezantimin tuaj profesional." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: styles$l.headerActions, children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: disableAccount,
            className: `${styles$l.powerBtn} ${form2.isAvailable ? styles$l.btnOnline : styles$l.btnOffline}`,
            title: form2.isAvailable ? "Çaktivizo" : "Aktivizo",
            children: [
              /* @__PURE__ */ jsx(Power, { size: 18, strokeWidth: 2.5 }),
              /* @__PURE__ */ jsx("span", { children: form2.isAvailable ? "Online" : "Në Pushim" })
            ]
          }
        ) })
      ] }),
      status2.message && /* @__PURE__ */ jsx("div", { className: `${styles$l.status} ${styles$l[status2.type]}`, children: status2.message }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.statsGrid, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$l.statBox, children: [
          /* @__PURE__ */ jsx("span", { className: styles$l.statIcon, children: "💬" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: styles$l.statVal, children: whatsappRequests }),
            /* @__PURE__ */ jsx("div", { className: styles$l.statTitle, children: "Klikime WhatsApp" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$l.statBox, onClick: () => setIsModalOpen((p) => ({ ...p, reviewsList: true })), children: [
          /* @__PURE__ */ jsx("span", { className: styles$l.statIcon, children: "⭐" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: styles$l.statVal, children: reviews.length }),
            /* @__PURE__ */ jsx("div", { className: styles$l.statTitle, children: "Vlerësime (Shih të gjitha)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$l.statBox, children: [
          /* @__PURE__ */ jsx("span", { className: styles$l.statIcon, children: "🛠️" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: styles$l.statVal, children: [
              form2.yearsExperience || "0",
              "+"
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$l.statTitle, children: "Vite Përvojë" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.editorGrid, children: [
        /* @__PURE__ */ jsxs("section", { className: styles$l.glassCard, children: [
          /* @__PURE__ */ jsx("div", { className: styles$l.cardHeader, children: /* @__PURE__ */ jsx("h3", { children: "Informacionet Kryesore" }) }),
          /* @__PURE__ */ jsxs("div", { className: styles$l.inputRow, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
              /* @__PURE__ */ jsx("label", { children: "Emri i Plotë" }),
              /* @__PURE__ */ jsx("input", { name: "name", value: form2.name, onChange: handleChange })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
              /* @__PURE__ */ jsx("label", { children: "WhatsApp" }),
              /* @__PURE__ */ jsx(
                PhoneInput,
                {
                  country: "xk",
                  value: form2.phoneNumber,
                  onChange: handlePhoneNum,
                  containerClass: styles$l.phoneContainer,
                  inputClass: styles$l.phoneInput
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$l.inputRow, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
              /* @__PURE__ */ jsx("label", { children: "Qyteti" }),
              /* @__PURE__ */ jsxs("select", { name: "city", value: form2.city, onChange: handleChange, required: true, className: styles$l.select, children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Zgjidh Qytetin" }),
                cities.map((cit) => /* @__PURE__ */ jsx("option", { value: cit, children: cit }, cit))
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
              /* @__PURE__ */ jsx("label", { children: "Përshkrimi i punës (Bio)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  name: "bio",
                  value: form2.bio,
                  onChange: handleChange,
                  rows: "1",
                  placeholder: "Shërbimet tuaja...",
                  style: { minHeight: "45px" }
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: styles$l.glassCard, children: [
          /* @__PURE__ */ jsx("div", { className: styles$l.cardHeader, children: /* @__PURE__ */ jsx("h3", { children: "Shërbimi & Pagesa" }) }),
          /* @__PURE__ */ jsxs("div", { className: styles$l.inputRow, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
              /* @__PURE__ */ jsx("label", { children: "Kategoria" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  name: "category",
                  value: form2.category,
                  onChange: handleChange,
                  children: [
                    categories$1.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat)),
                    form2.category && !categories$1.includes(form2.category) && /* @__PURE__ */ jsx("option", { value: form2.category, children: form2.category })
                  ]
                }
              ),
              form2.category === "Tjetër" && /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
                /* @__PURE__ */ jsx("label", { children: "Profesioni yt" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "customCategory",
                    value: form2.customCategory,
                    onChange: handleChange,
                    placeholder: "Shkruaj profesionin tënd...",
                    maxLength: 40
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
              /* @__PURE__ */ jsx("label", { children: "Çmimi Fillestar (€)" }),
              /* @__PURE__ */ jsx("input", { name: "hourlyRate", type: "number", min: "0", value: form2.hourlyRate, onChange: handleChange })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$l.field, children: [
            /* @__PURE__ */ jsx("label", { children: "Vite Përvojë" }),
            /* @__PURE__ */ jsx("input", { name: "yearsExperience", value: form2.yearsExperience, onChange: handleChange })
          ] })
        ] })
      ] })
    ] }) : activeTab2 === "verification" ? (
      /* --- VERIFICATION TAB CONTENT --- */
      /* @__PURE__ */ jsx(
        VerificationSection,
        {
          isVerified: form2.isVerified,
          isPending,
          status: status2,
          idPreview,
          idFile,
          isVerifying,
          verificationFailed,
          onIdSelect: handleIdSelect,
          onUpload: handleUploadVerification,
          onRetake: handleRetake,
          setActiveTab
        }
      )
    ) : activeTab2 === "pro" ? /* @__PURE__ */ jsx(
      Pro,
      {
        isPro: form2.isPro,
        onUpgradeClick: () => setIsModalOpen((p) => ({ ...p, pro: true })),
        form: form2,
        onStatus: setStatus,
        handleChange: handleInstantSave,
        link: personalLink,
        lastReviewDate: reviews.length > 0 ? reviews[0].createdAt || reviews[0].approvedAt : null
      }
    ) : null }),
    /* @__PURE__ */ jsxs("aside", { className: styles$l.rightRail, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$l.railSection, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$l.railHeader, children: [
          /* @__PURE__ */ jsx("h3", { children: "Portofoli" }),
          /* @__PURE__ */ jsxs("label", { className: styles$l.addBtn, children: [
            "+",
            /* @__PURE__ */ jsx("input", { type: "file", multiple: true, onChange: handlePortfolioSelect, hidden: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$l.portfolioScroll, children: [
          form2.portfolio.map((url, i) => /* @__PURE__ */ jsxs("div", { className: styles$l.portThumb, children: [
            /* @__PURE__ */ jsx("img", { src: url, alt: "work" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteExistingPortfolio(url), children: "×" })
          ] }, i)),
          portfolioFiles.map((f, i) => /* @__PURE__ */ jsxs("div", { className: styles$l.portThumb, children: [
            /* @__PURE__ */ jsx("img", { src: URL.createObjectURL(f), alt: "new" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteNewPortfolio(i), children: "×" })
          ] }, i))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.railSection, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$l.railHeader, children: [
          /* @__PURE__ */ jsx("h3", { children: "Kontaktet e Fundit" }),
          /* @__PURE__ */ jsx("button", { className: styles$l.reqBtn, onClick: () => setIsModalOpen((p) => ({ ...p, review: true })), children: "Kërko Vlerësim" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: styles$l.sessionsList, children: sessions.length === 0 ? /* @__PURE__ */ jsx("p", { className: styles$l.empty, children: "Nuk ka kontakte të reja." }) : sessions.map((s) => {
          var _a2;
          return /* @__PURE__ */ jsxs("div", { className: styles$l.sessionItem, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$l.sessionInfo, children: [
              /* @__PURE__ */ jsx("strong", { children: s.customerName || "Klient" }),
              /* @__PURE__ */ jsx("span", { children: (_a2 = s.createdAt) == null ? void 0 : _a2.toDate().toLocaleDateString("sq-AL") })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$l.sessionStatus, children: "I pa vlerësuar" })
          ] }, s.id);
        }) })
      ] })
    ] }),
    isDirty && /* @__PURE__ */ jsxs("div", { className: styles$l.stickyAction, children: [
      /* @__PURE__ */ jsx("p", { children: "Keni bërë ndryshime në profil." }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.footerBtns, children: [
        /* @__PURE__ */ jsx("button", { onClick: handleCancel, className: styles$l.btnCancel, children: "Anulo" }),
        /* @__PURE__ */ jsx("button", { onClick: handleSave, className: styles$l.btnSave, disabled: saving, children: saving ? "Duke ruajtur..." : "Ruaj Ndryshimet" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { open: isModalOpen.avatar, onClose: () => setIsModalOpen((p) => ({ ...p, avatar: false })), children: /* @__PURE__ */ jsxs("div", { className: styles$l.modalContent, children: [
      /* @__PURE__ */ jsx("h2", { children: "Ndrysho foton e profilit" }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.avatarUploadArea, children: [
        /* @__PURE__ */ jsx("input", { type: "file", id: "avatar-upload-modal", accept: "image/*", onChange: handleProfileSelect, hidden: true }),
        /* @__PURE__ */ jsx("label", { htmlFor: "avatar-upload-modal", className: styles$l.uploadBtn, children: "Ngarko foto të re" }),
        form2.profileUrl && /* @__PURE__ */ jsx("button", { className: styles$l.deleteBtn, onClick: handleDeleteProfile, children: "Fshi foton aktuale" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Ose zgjidh një ilustrim:" }),
      /* @__PURE__ */ jsx("div", { className: styles$l.avatarGridModal, children: DEFAULT_AVATARS.map((url, idx) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `${styles$l.avatarOptionModal} ${form2.profileUrl === url ? styles$l.selected : ""}`,
          onClick: () => {
            handleSelectDefaultAvatar(url);
            setIsModalOpen((p) => ({ ...p, avatar: false }));
          },
          children: /* @__PURE__ */ jsx("img", { src: url, alt: `avatar-${idx}` })
        },
        idx
      )) }),
      /* @__PURE__ */ jsx("button", { className: styles$l.closeBtn, onClick: () => setIsModalOpen((p) => ({ ...p, avatar: false })), children: "Mbylle" })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { open: isModalOpen.reviewsList, onClose: () => setIsModalOpen((p) => ({ ...p, reviewsList: false })), children: /* @__PURE__ */ jsxs("div", { className: styles$l.modalContent, children: [
      /* @__PURE__ */ jsx("h2", { children: "Vlerësimet e Klientëve" }),
      /* @__PURE__ */ jsx("div", { className: styles$l.reviewsModalList, children: reviews.length === 0 ? /* @__PURE__ */ jsx("p", { className: styles$l.empty, children: "Nuk ka vlerësime ende." }) : reviews.map((r) => /* @__PURE__ */ jsxs("div", { className: styles$l.modalReviewCard, children: [
        /* @__PURE__ */ jsx("div", { className: styles$l.stars, children: "⭐".repeat(r.rating) }),
        /* @__PURE__ */ jsxs("p", { children: [
          '"',
          r.comment,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("small", { children: [
          "- ",
          r.customerName || "Klient"
        ] })
      ] }, r.id)) }),
      /* @__PURE__ */ jsx("button", { className: styles$l.closeBtn, onClick: () => setIsModalOpen((p) => ({ ...p, reviewsList: false })), children: "Mbylle" })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { open: isModalOpen.review, onClose: () => setIsModalOpen((p) => ({ ...p, review: false })), children: /* @__PURE__ */ jsx(ReviewModal, { user, sessions, onClose: () => setIsModalOpen((p) => ({ ...p, review: false })) }) }),
    /* @__PURE__ */ jsx(Modal, { open: isModalOpen.pro, onClose: () => setIsModalOpen((p) => ({ ...p, pro: false })), children: /* @__PURE__ */ jsxs("div", { className: styles$l.modalContent, children: [
      /* @__PURE__ */ jsx("h2", { children: "PRO Membership" }),
      /* @__PURE__ */ jsx("p", { children: "Zhblloko të gjitha mundësitë" }),
      /* @__PURE__ */ jsxs("ul", { className: styles$l.benefits, children: [
        /* @__PURE__ */ jsx("li", { children: "🚀 Renditje Prioritare" }),
        /* @__PURE__ */ jsx("li", { children: "💎 Distinktiv i Verifikuar" }),
        /* @__PURE__ */ jsx("li", { children: "🖼️ Portofolio pa Limit" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.modalActions, children: [
        /* @__PURE__ */ jsx("button", { className: styles$l.primaryBtn, onClick: async () => {
          const getPro = httpsCallable(functions, "handleGetPro");
          await getPro();
          setForm((prev) => ({
            ...prev,
            isPro: true,
            showProStar: true,
            isFeatured: true,
            quickResponse: true
          }));
          setIsModalOpen((p) => ({ ...p, pro: false }));
        }, children: "Vazhdo te Pagesa (€14.99)" }),
        /* @__PURE__ */ jsx("button", { className: styles$l.secondaryBtn, onClick: () => setIsModalOpen((p) => ({ ...p, pro: false })), children: "Më vonë" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { open: isModalOpen.error, onClose: () => setIsModalOpen((p) => ({ ...p, error: false })), children: /* @__PURE__ */ jsxs("div", { className: styles$l.modalContent, children: [
      /* @__PURE__ */ jsx("div", { className: styles$l.errorIcon, children: "⚠️" }),
      /* @__PURE__ */ jsx("h2", { children: "Numri i pasaktë" }),
      /* @__PURE__ */ jsx("p", { children: "Numri duhet të ketë të paktën 8 shifra." }),
      /* @__PURE__ */ jsx("button", { className: styles$l.primaryBtn, onClick: () => setIsModalOpen((p) => ({ ...p, error: false })), children: "Kuptova" })
    ] }) }),
    /* @__PURE__ */ jsx(Modal, { open: isModalOpen.health, onClose: () => setIsModalOpen((p) => ({ ...p, health: false })), children: /* @__PURE__ */ jsxs("div", { className: styles$l.modalContent, children: [
      /* @__PURE__ */ jsxs("h2", { children: [
        "Statusi i Profilit: ",
        /* @__PURE__ */ jsx("span", { style: { color: health.color }, children: health.score })
      ] }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: health.label }) }),
      /* @__PURE__ */ jsx("p", { children: health.desc }),
      /* @__PURE__ */ jsxs("div", { className: styles$l.statsRow, children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Klikime: ",
          whatsappRequests
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Vlerësime: ",
          reviews.length
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { className: styles$l.primaryBtn, onClick: () => setIsModalOpen((p) => ({ ...p, health: false })), children: "E Kuptova" })
    ] }) })
  ] });
}
const settingsContainer = "_settingsContainer_5wbj7_3";
const pageTitle = "_pageTitle_5wbj7_39";
const securityWarningBanner = "_securityWarningBanner_5wbj7_57";
const warningContent = "_warningContent_5wbj7_97";
const warningIcon = "_warningIcon_5wbj7_109";
const warningTitle = "_warningTitle_5wbj7_117";
const warningDesc = "_warningDesc_5wbj7_131";
const bannerButtons = "_bannerButtons_5wbj7_143";
const verifyBtnInline = "_verifyBtnInline_5wbj7_153";
const refreshBtnInline = "_refreshBtnInline_5wbj7_181";
const sectionsWrapper = "_sectionsWrapper_5wbj7_215";
const sectionTitle$1 = "_sectionTitle_5wbj7_227";
const card$3 = "_card_5wbj7_245";
const lockedSection = "_lockedSection_5wbj7_263";
const lockHint = "_lockHint_5wbj7_295";
const displayRow = "_displayRow_5wbj7_319";
const info = "_info_5wbj7_331";
const verifiedTag = "_verifiedTag_5wbj7_361";
const unverifiedTag = "_unverifiedTag_5wbj7_363";
const editForm = "_editForm_5wbj7_369";
const inputGroup$3 = "_inputGroup_5wbj7_393";
const buttonGroup$1 = "_buttonGroup_5wbj7_449";
const editToggleButton = "_editToggleButton_5wbj7_461";
const updateButton = "_updateButton_5wbj7_489";
const cancelButton = "_cancelButton_5wbj7_517";
const dangerText = "_dangerText_5wbj7_537";
const dangerCard = "_dangerCard_5wbj7_545";
const dangerRow = "_dangerRow_5wbj7_555";
const dangerInfo = "_dangerInfo_5wbj7_569";
const deleteButton = "_deleteButton_5wbj7_595";
const deleteButtonFull = "_deleteButtonFull_5wbj7_625";
const statusMessage = "_statusMessage_5wbj7_647";
const success$1 = "_success_5wbj7_665";
const error$1 = "_error_5wbj7_677";
const centeredContainer = "_centeredContainer_5wbj7_691";
const loaderWrapper = "_loaderWrapper_5wbj7_707";
const jumpingDot = "_jumpingDot_5wbj7_719";
const loginPulseButton = "_loginPulseButton_5wbj7_751";
const styles$g = {
  settingsContainer,
  pageTitle,
  securityWarningBanner,
  warningContent,
  warningIcon,
  warningTitle,
  warningDesc,
  bannerButtons,
  verifyBtnInline,
  refreshBtnInline,
  sectionsWrapper,
  sectionTitle: sectionTitle$1,
  card: card$3,
  lockedSection,
  lockHint,
  displayRow,
  info,
  verifiedTag,
  unverifiedTag,
  editForm,
  inputGroup: inputGroup$3,
  buttonGroup: buttonGroup$1,
  editToggleButton,
  updateButton,
  cancelButton,
  dangerText,
  dangerCard,
  dangerRow,
  dangerInfo,
  deleteButton,
  deleteButtonFull,
  statusMessage,
  success: success$1,
  error: error$1,
  centeredContainer,
  loaderWrapper,
  jumpingDot,
  loginPulseButton
};
const ProfileSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    email: false,
    password: false,
    deleting: false
  });
  const [passwords, setPassword] = useState({ current: "", next: "" });
  const [newEmail, setNewEmail] = useState("");
  const [status2, setStatus] = useState({ msg: "", type: "" });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setNewEmail(currentUser.email);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  async function verifyUser(currentPassword) {
    const user2 = auth.currentUser;
    if (!user2) throw new Error("No user logged in");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
  }
  async function handleEditEmail(e) {
    var _a2;
    e.preventDefault();
    try {
      setStatus({ msg: "Duke përditësuar...", type: "" });
      await verifyUser(passwords.current);
      const functions2 = getFunctions(void 0, "us-central1");
      const requestEmailChange = httpsCallable(
        functions2,
        "requestEmailChange"
      );
      const result = await requestEmailChange({
        newEmail: newEmail.trim().toLowerCase()
      });
      setIsEditing((prev) => ({ ...prev, email: false }));
      setPassword((prev) => ({ ...prev, current: "" }));
      setStatus({
        msg: ((_a2 = result.data) == null ? void 0 : _a2.message) || "Një link konfirmimi u dërgua në email-in e ri. Klikoni linkun për të përfunduar ndryshimin.",
        type: "success"
      });
    } catch (err) {
      console.error("Email change request failed:", err);
      let message2 = "Dështoi përditësimi. Kontrolloni fjalëkalimin dhe email-in e ri.";
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        message2 = "Fjalëkalimi aktual nuk është i saktë.";
      } else if (err.code === "functions/failed-precondition") {
        message2 = "Ju lutem rikyçuni në llogari dhe provoni përsëri.";
      } else if (err.code === "functions/already-exists") {
        message2 = "Ky email nuk mund të përdoret. Provoni një tjetër.";
      }
      setStatus({
        msg: message2,
        type: "error"
      });
    }
  }
  async function handleUpdatePassword(e) {
    e.preventDefault();
    try {
      setStatus({ msg: "Duke përditësuar...", type: "" });
      await verifyUser(passwords.current);
      await updatePassword(auth.currentUser, passwords.next);
      setIsEditing((prev) => ({ ...prev, password: false }));
      setPassword({ current: "", next: "" });
      setStatus({ msg: "Fjalëkalimi u ndryshua me sukses!", type: "success" });
      window.scroll(0, 0);
    } catch (err) {
      window.scroll(0, 0);
      if (err.code === "auth/requires-recent-login") {
        window.scroll(0, 0);
        setStatus({
          msg: "Ju lutem dilni dhe hyni përsëri që të mund të ndryshoni email-in.",
          type: "error"
        });
      } else {
        setStatus({
          msg: "Dështoi përditësimi. Sigurohuni që fjalëkalimi është i saktë.",
          type: "error"
        });
      }
    }
  }
  async function handleGhostAccount(e) {
    e.preventDefault();
    try {
      setStatus({ msg: "Duke procesuar fshirjen...", type: "" });
      await verifyUser(passwords.current);
      const userUid = auth.currentUser.uid;
      const userDocRef = doc(db, "workers", userUid);
      const statusRef = doc(db, "metadata", "globalStats");
      const batch = writeBatch(db);
      batch.update(userDocRef, {
        isActive: false,
        deactivatedAt: serverTimestamp()
      });
      batch.update(statusRef, {
        workerCount: increment(-1)
      });
      await batch.commit();
      await auth.currentUser.delete();
      setStatus({ msg: "Llogaria u fshi me sukses.", type: "success" });
      window.scroll(0, 0);
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setStatus({
          msg: "Ju lutem ri-hyni në llogari për të kryer këtë veprim.",
          type: "error"
        });
        window.scroll(0, 0);
      } else {
        setStatus({
          msg: "Fjalëkalimi i gabuar. Provoni përsëri.",
          type: "error"
        });
      }
      window.scroll(0, 0);
    }
  }
  const handleVerifyEmail = async () => {
    setStatus({
      msg: "Duke dërguar e-mailin...",
      type: ""
    });
    try {
      const functions2 = getFunctions(void 0, "us-central1");
      const sendVerificationEmail = httpsCallable(
        functions2,
        "sendVerificationEmail"
      );
      const result = await sendVerificationEmail();
      setStatus({
        msg: result.data.message || "Linku i verifikimit u dërgua me sukses! Kontrolloni inbox-in tuaj.",
        type: "success"
      });
      setTimeout(() => {
        setStatus({ msg: "", type: "" });
      }, 6e3);
    } catch (error2) {
      console.error("Verification email error:", error2);
      setStatus({
        msg: "Dështoi dërgimi: " + error2.message,
        type: "error"
      });
    }
  };
  const handleRefreshStatus = async () => {
    try {
      setStatus({ msg: "Duke u sinkronizuar...", type: "" });
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setUser(updatedUser);
      if (updatedUser.emailVerified) {
        setStatus({ msg: "Sukses! Email-i u verifikua.", type: "success" });
      } else {
        setStatus({ msg: "Email-i ende nuk është verifikuar. Kontrolloni 'Spam'.", type: "error" });
      }
    } catch (error2) {
      setStatus({ msg: "Dështoi rifreskimi: " + error2.message, type: "error" });
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: styles$g.centeredContainer, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$g.loaderWrapper, children: [
        /* @__PURE__ */ jsx("div", { className: styles$g.jumpingDot }),
        /* @__PURE__ */ jsx("div", { className: styles$g.jumpingDot }),
        /* @__PURE__ */ jsx("div", { className: styles$g.jumpingDot })
      ] }),
      /* @__PURE__ */ jsx("p", { className: styles$g.animatedText, children: "Duke u sinkronizuar me Mjeshtri.ks..." })
    ] });
  }
  if (!user) {
    return /* @__PURE__ */ jsxs("div", { className: styles$g.centeredContainer, children: [
      /* @__PURE__ */ jsx("div", { className: styles$g.lockIconWrapper, children: /* @__PURE__ */ jsx("span", { className: styles$g.lockEmoji, children: "🔒" }) }),
      /* @__PURE__ */ jsx("p", { className: styles$g.errorText, children: "Ju lutem hyni në llogari për të parë cilësimet." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: styles$g.loginPulseButton,
          onClick: () => navigate("/login"),
          children: "Hyni Këtu"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: styles$g.settingsContainer, children: [
    /* @__PURE__ */ jsx("h1", { className: styles$g.pageTitle, children: "Cilësimet e Llogarisë" }),
    !user.emailVerified && /* @__PURE__ */ jsxs("div", { className: styles$g.securityWarningBanner, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$g.warningContent, children: [
        /* @__PURE__ */ jsx("span", { className: styles$g.warningIcon, children: "⚠️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: styles$g.warningTitle, children: "Verifikoni Email-in Tuaj" }),
          /* @__PURE__ */ jsx("p", { className: styles$g.warningDesc, children: "Ju lutem kontrolloni postën tuaj elektronike." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$g.bannerButtons, children: [
        /* @__PURE__ */ jsx("button", { onClick: handleVerifyEmail, className: styles$g.verifyBtnInline, children: "Dërgo Linkun" }),
        /* @__PURE__ */ jsx("button", { onClick: handleRefreshStatus, className: styles$g.refreshBtnInline, children: "Kam klikuar linkun ↻" })
      ] })
    ] }),
    status2.msg && /* @__PURE__ */ jsx("div", { className: `${styles$g.statusMessage} ${status2.type === "success" ? styles$g.success : styles$g.error}`, children: status2.msg }),
    /* @__PURE__ */ jsxs("div", { className: styles$g.sectionsWrapper, children: [
      /* @__PURE__ */ jsxs("section", { className: styles$g.settingsSection, children: [
        /* @__PURE__ */ jsx("h2", { className: styles$g.sectionTitle, children: "E-mail dhe Identiteti" }),
        /* @__PURE__ */ jsx("div", { className: styles$g.card, children: !isEditing.email ? /* @__PURE__ */ jsxs("div", { className: styles$g.displayRow, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$g.info, children: [
            /* @__PURE__ */ jsx("label", { children: "Adresa aktuale" }),
            /* @__PURE__ */ jsxs("p", { children: [
              user.email,
              " ",
              user.emailVerified ? /* @__PURE__ */ jsx("span", { className: styles$g.verifiedTag, children: "✓" }) : /* @__PURE__ */ jsx("span", { className: styles$g.unverifiedTag, children: "!" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { className: styles$g.editToggleButton, onClick: () => setIsEditing((p) => ({ ...p, email: true })), children: "Ndrysho" })
        ] }) : /* @__PURE__ */ jsxs("form", { className: styles$g.editForm, onSubmit: handleEditEmail, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$g.inputGroup, children: [
            /* @__PURE__ */ jsx("label", { children: "E-mail i ri" }),
            /* @__PURE__ */ jsx("input", { type: "email", required: true, value: newEmail, onChange: (e) => setNewEmail(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$g.inputGroup, children: [
            /* @__PURE__ */ jsx("label", { children: "Fjalëkalimi aktual" }),
            /* @__PURE__ */ jsx("input", { type: "password", required: true, value: passwords.current, placeholder: "••••••••", onChange: (e) => setPassword((p) => ({ ...p, current: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$g.buttonGroup, children: [
            /* @__PURE__ */ jsx("button", { type: "submit", className: styles$g.updateButton, children: "Ruaj Email-in" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: styles$g.cancelButton, onClick: () => setIsEditing((p) => ({ ...p, email: false })), children: "Anulo" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: `${styles$g.settingsSection} ${!user.emailVerified ? styles$g.lockedSection : ""}`, children: [
        /* @__PURE__ */ jsx("h2", { className: styles$g.sectionTitle, children: "Siguria e Fjalëkalimit" }),
        /* @__PURE__ */ jsxs("div", { className: styles$g.card, children: [
          !isEditing.password ? /* @__PURE__ */ jsxs("div", { className: styles$g.displayRow, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$g.info, children: [
              /* @__PURE__ */ jsx("label", { children: "Fjalëkalimi" }),
              /* @__PURE__ */ jsx("p", { children: "••••••••••••" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: styles$g.editToggleButton,
                disabled: !user.emailVerified,
                onClick: () => setIsEditing((p) => ({ ...p, password: true })),
                children: "Ndrysho"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("form", { className: styles$g.editForm, onSubmit: handleUpdatePassword, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$g.inputGroup, children: [
              /* @__PURE__ */ jsx("label", { children: "Fjalëkalimi aktual" }),
              /* @__PURE__ */ jsx("input", { type: "password", required: true, onChange: (e) => setPassword((p) => ({ ...p, current: e.target.value })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$g.inputGroup, children: [
              /* @__PURE__ */ jsx("label", { children: "Fjalëkalimi i ri" }),
              /* @__PURE__ */ jsx("input", { type: "password", required: true, onChange: (e) => setPassword((p) => ({ ...p, next: e.target.value })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$g.buttonGroup, children: [
              /* @__PURE__ */ jsx("button", { type: "submit", className: styles$g.updateButton, children: "Ndrysho Fjalëkalimin" }),
              /* @__PURE__ */ jsx("button", { type: "button", className: styles$g.cancelButton, onClick: () => setIsEditing((p) => ({ ...p, password: false })), children: "Anulo" })
            ] })
          ] }),
          !user.emailVerified && /* @__PURE__ */ jsx("p", { className: styles$g.lockHint, children: "Duhet të verifikoni email-in për të ndryshuar fjalëkalimin." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: `${styles$g.settingsSection} ${!user.emailVerified ? styles$g.lockedSection : ""}`, children: [
        /* @__PURE__ */ jsx("h2", { className: `${styles$g.sectionTitle} ${styles$g.dangerText}`, children: "Zona e Rrezikut" }),
        /* @__PURE__ */ jsxs("div", { className: `${styles$g.card} ${styles$g.dangerCard}`, children: [
          !isEditing.deleting ? /* @__PURE__ */ jsxs("div", { className: styles$g.dangerRow, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$g.dangerInfo, children: [
              /* @__PURE__ */ jsx("h3", { children: "Fshini Llogarinë" }),
              /* @__PURE__ */ jsx("p", { children: "Ky veprim është i pakthyeshëm. Të dhënat tuaja do të fshihen." })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: styles$g.deleteButton,
                disabled: !user.emailVerified,
                onClick: () => setIsEditing((p) => ({ ...p, deleting: true })),
                children: "Fshi Llogarinë"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleGhostAccount, className: styles$g.editForm, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$g.inputGroup, children: [
              /* @__PURE__ */ jsx("label", { children: "Shkruani fjalëkalimin për fshirje:" }),
              /* @__PURE__ */ jsx("input", { type: "password", required: true, placeholder: "••••••••", onChange: (e) => setPassword((p) => ({ ...p, current: e.target.value })) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$g.buttonGroup, children: [
              /* @__PURE__ */ jsx("button", { type: "submit", className: styles$g.deleteButtonFull, children: "Konfirmo Fshirjen" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: styles$g.cancelButton,
                  onClick: () => {
                    setIsEditing((p) => ({ ...p, deleting: false }));
                    setPassword({ current: "", next: "" });
                  },
                  children: "Anulo"
                }
              )
            ] })
          ] }),
          !user.emailVerified && /* @__PURE__ */ jsx("p", { className: styles$g.lockHint, children: "Duhet të verifikoni email-in për të fshirë llogarinë." })
        ] })
      ] })
    ] })
  ] });
};
const page$1 = "_page_gnrle_3";
const hero$1 = "_hero_gnrle_19";
const heroBg = "_heroBg_gnrle_37";
const heroContent$1 = "_heroContent_gnrle_57";
const heroMain = "_heroMain_gnrle_75";
const imageFrame = "_imageFrame_gnrle_87";
const mainAvatar = "_mainAvatar_gnrle_103";
const expTag = "_expTag_gnrle_119";
const expNum = "_expNum_gnrle_145";
const expLabel = "_expLabel_gnrle_147";
const topBadges = "_topBadges_gnrle_151";
const catBadge = "_catBadge_gnrle_153";
const verifiedPro = "_verifiedPro_gnrle_155";
const heroTitle$2 = "_heroTitle_gnrle_159";
const heroStats = "_heroStats_gnrle_177";
const statItem = "_statItem_gnrle_179";
const starIcon = "_starIcon_gnrle_183";
const statDivider = "_statDivider_gnrle_185";
const bodyContainer = "_bodyContainer_gnrle_189";
const contentGrid = "_contentGrid_gnrle_191";
const cardSection = "_cardSection_gnrle_195";
const miniTitle = "_miniTitle_gnrle_197";
const descriptionText = "_descriptionText_gnrle_199";
const portfolioDisplay = "_portfolioDisplay_gnrle_205";
const portfolioItem = "_portfolioItem_gnrle_207";
const stickyCard = "_stickyCard_gnrle_215";
const priceHeader = "_priceHeader_gnrle_217";
const actionButtons$2 = "_actionButtons_gnrle_221";
const secondaryCallBtn = "_secondaryCallBtn_gnrle_237";
const trustFooter = "_trustFooter_gnrle_237";
const feedbackSection = "_feedbackSection_gnrle_237";
const feedbackHeader = "_feedbackHeader_gnrle_237";
const feedbackGrid = "_feedbackGrid_gnrle_237";
const modernReviewCard = "_modernReviewCard_gnrle_237";
const reviewScore = "_reviewScore_gnrle_237";
const starFilled = "_starFilled_gnrle_237";
const starEmpty = "_starEmpty_gnrle_237";
const reviewText = "_reviewText_gnrle_237";
const reviewerInfo = "_reviewerInfo_gnrle_237";
const reviewerAvatar = "_reviewerAvatar_gnrle_237";
const reviewerName = "_reviewerName_gnrle_237";
const reviewDate = "_reviewDate_gnrle_237";
const mobileAction = "_mobileAction_gnrle_237";
const mobileActionInner = "_mobileActionInner_gnrle_237";
const mobilePricing = "_mobilePricing_gnrle_237";
const errorCard = "_errorCard_gnrle_289";
const errorTitle = "_errorTitle_gnrle_377";
const verifiedBadge = "_verifiedBadge_gnrle_473";
const bookingSidebar = "_bookingSidebar_gnrle_739";
const portfolioScrollContainer = "_portfolioScrollContainer_gnrle_791";
const styles$f = {
  page: page$1,
  hero: hero$1,
  heroBg,
  heroContent: heroContent$1,
  heroMain,
  imageFrame,
  mainAvatar,
  expTag,
  expNum,
  expLabel,
  topBadges,
  catBadge,
  verifiedPro,
  heroTitle: heroTitle$2,
  heroStats,
  statItem,
  starIcon,
  statDivider,
  bodyContainer,
  contentGrid,
  cardSection,
  miniTitle,
  descriptionText,
  portfolioDisplay,
  portfolioItem,
  stickyCard,
  priceHeader,
  actionButtons: actionButtons$2,
  secondaryCallBtn,
  trustFooter,
  feedbackSection,
  feedbackHeader,
  feedbackGrid,
  modernReviewCard,
  reviewScore,
  starFilled,
  starEmpty,
  reviewText,
  reviewerInfo,
  reviewerAvatar,
  reviewerName,
  reviewDate,
  mobileAction,
  mobileActionInner,
  mobilePricing,
  errorCard,
  errorTitle,
  verifiedBadge,
  bookingSidebar,
  portfolioScrollContainer
};
function UserProfile() {
  var _a2, _b2;
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [worker, setWorker] = useState(((_a2 = location.state) == null ? void 0 : _a2.workerData) || null);
  const [loading, setLoading] = useState(!worker);
  const [error2, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const disabled = true;
  useEffect(() => {
    let isMounted = true;
    const fetchData = async (activeID) => {
      try {
        setLoading(true);
        const docRef = doc(db, "workers", activeID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && isMounted) {
          setWorker(docSnap.data());
        } else if (isMounted) {
          setError("Profil nuk u gjet.");
          return;
        }
        const q = query(
          collection(db, "reviews"),
          where("workerId", "==", activeID),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        if (isMounted) {
          setReviews(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        if (isMounted) setError("Ups! Nuk mundëm të gjenim profilin.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      var _a3, _b3;
      const activeID = urlId || ((_b3 = (_a3 = location.state) == null ? void 0 : _a3.workerData) == null ? void 0 : _b3.uid) || (currentUser == null ? void 0 : currentUser.uid);
      if (activeID) {
        fetchData(activeID);
      } else {
        setLoading(false);
        navigate("/login");
      }
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, [urlId, navigate, location.state]);
  if (loading) {
    return /* @__PURE__ */ jsx(Loading, {});
  }
  if (error2) {
    return /* @__PURE__ */ jsx("div", { className: styles$f.errorOverlay, children: /* @__PURE__ */ jsxs("div", { className: styles$f.errorCard, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: "3rem" }, children: "🛠️" }),
      /* @__PURE__ */ jsx("h2", { className: styles$f.errorTitle, children: "Lidhja dështoi" }),
      /* @__PURE__ */ jsx("p", { className: styles$f.errorText, children: "Nuk mundëm të siguronim të dhënat e mjeshtrit për momentin. Ju lutem kontrolloni internetin ose provoni përsëri." }),
      /* @__PURE__ */ jsx("button", { className: styles$f.refreshBtn, onClick: () => window.location.reload(), children: "PROVO PËRSËRI" })
    ] }) });
  }
  if (!worker) {
    return /* @__PURE__ */ jsxs("div", { className: styles$f.notFound, children: [
      /* @__PURE__ */ jsx("p", { children: "Mjeshtri nuk u gjet." }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate("/workers"), className: styles$f.backButton, children: "Kthehu te lista" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: styles$f.page, children: [
    /* @__PURE__ */ jsxs("section", { className: styles$f.hero, children: [
      /* @__PURE__ */ jsx("div", { className: styles$f.heroBg, style: { backgroundImage: `url(${worker.profilePic})` } }),
      /* @__PURE__ */ jsx("div", { className: styles$f.heroContent, children: /* @__PURE__ */ jsxs("div", { className: styles$f.heroMain, children: [
        /* @__PURE__ */ jsx("div", { className: styles$f.visualSide, children: /* @__PURE__ */ jsxs("div", { className: styles$f.imageFrame, children: [
          /* @__PURE__ */ jsx("img", { src: worker.profilePic, alt: worker.fullName, className: styles$f.mainAvatar }),
          /* @__PURE__ */ jsxs("div", { className: styles$f.expTag, children: [
            /* @__PURE__ */ jsxs("span", { className: styles$f.expNum, children: [
              worker.experienceYears || 0,
              "+"
            ] }),
            /* @__PURE__ */ jsx("span", { className: styles$f.expLabel, children: "VITE PËRVOJË" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: styles$f.textSide, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$f.topBadges, children: [
            /* @__PURE__ */ jsx("span", { className: styles$f.catBadge, children: worker.category }),
            worker.isPro && /* @__PURE__ */ jsx("span", { className: styles$f.verifiedPro, children: "PRO" }),
            worker.isVerified && /* @__PURE__ */ jsx("span", { className: styles$f.verifiedBadge, children: /* @__PURE__ */ jsx("img", { src: Verified, alt: "verified badge" }) })
          ] }),
          /* @__PURE__ */ jsx("h1", { className: styles$f.heroTitle, children: worker.fullName }),
          /* @__PURE__ */ jsxs("div", { className: styles$f.heroStats, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$f.statItem, children: [
              /* @__PURE__ */ jsx("img", { src: MapPin, alt: "location" }),
              /* @__PURE__ */ jsxs("span", { children: [
                worker.city,
                ", KS"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: styles$f.statDivider }),
            /* @__PURE__ */ jsxs("div", { className: styles$f.statItem, children: [
              /* @__PURE__ */ jsx("span", { className: styles$f.starIcon, children: "★" }),
              /* @__PURE__ */ jsxs("span", { children: [
                worker.rating || "5.0",
                " Score"
              ] })
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$f.bodyContainer, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$f.contentGrid, children: [
        /* @__PURE__ */ jsxs("main", { className: styles$f.detailsArea, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$f.cardSection, children: [
            /* @__PURE__ */ jsx("h3", { className: styles$f.miniTitle, children: "Rreth Meje" }),
            /* @__PURE__ */ jsx("p", { className: styles$f.descriptionText, children: worker.bio || "Ky mjeshtër nuk ka shtuar ende një biografi." })
          ] }),
          ((_b2 = worker.portfolio) == null ? void 0 : _b2.length) > 0 && /* @__PURE__ */ jsxs("div", { className: styles$f.cardSection, children: [
            /* @__PURE__ */ jsx("h3", { className: styles$f.miniTitle, children: "Punimet e fundit" }),
            /* @__PURE__ */ jsx("div", { className: styles$f.portfolioScrollContainer, children: /* @__PURE__ */ jsx("div", { className: styles$f.portfolioDisplay, children: worker.portfolio.map((img, i) => /* @__PURE__ */ jsx("div", { className: styles$f.portfolioItem, children: /* @__PURE__ */ jsx("img", { src: img, alt: `Work ${i}` }) }, i)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("aside", { className: styles$f.bookingSidebar, children: /* @__PURE__ */ jsxs("div", { className: styles$f.stickyCard, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$f.priceHeader, children: [
            /* @__PURE__ */ jsx("p", { children: "Tarifa Fillestare" }),
            /* @__PURE__ */ jsx("h2", { children: worker.startingPrice ? `${worker.startingPrice}€` : "Me marrëveshje" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$f.actionButtons, children: [
            /* @__PURE__ */ jsx(
              WhatsAppButton,
              {
                workerId: worker.id,
                phoneNumber: worker.phoneNumber,
                workerName: worker.fullName,
                disabled
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/${worker.phoneNumber.replace(/\D/g, "")}`,
                target: "_blank",
                rel: "noreferrer",
                className: styles$f.secondaryCallBtn,
                children: "Bisedo direkt"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$f.trustFooter, children: [
            /* @__PURE__ */ jsx("p", { children: "✓ Verifikuar nga GjejNjerin.com" }),
            /* @__PURE__ */ jsx("p", { children: "✓ Reagim i shpejtë" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: styles$f.feedbackSection, children: [
        /* @__PURE__ */ jsx("div", { className: styles$f.feedbackHeader, children: /* @__PURE__ */ jsxs("h2", { children: [
          "Vlerësimet (",
          reviews.length,
          ")"
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: styles$f.feedbackGrid, children: reviews.length > 0 ? reviews.map((r) => {
          var _a3, _b3;
          return /* @__PURE__ */ jsxs("div", { className: styles$f.modernReviewCard, children: [
            /* @__PURE__ */ jsx("div", { className: styles$f.reviewScore, children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("span", { className: i < r.rating ? styles$f.starFilled : styles$f.starEmpty, children: "★" }, i)) }),
            /* @__PURE__ */ jsxs("p", { className: styles$f.reviewText, children: [
              '"',
              r.comment,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$f.reviewerInfo, children: [
              /* @__PURE__ */ jsx("div", { className: styles$f.reviewerAvatar, children: ((_a3 = r.customerName) == null ? void 0 : _a3[0]) || "?" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: styles$f.reviewerName, children: r.customerName }),
                /* @__PURE__ */ jsx("p", { className: styles$f.reviewDate, children: ((_b3 = r.createdAt) == null ? void 0 : _b3.toDate) ? r.createdAt.toDate().toLocaleDateString("sq-AL") : "Sot" })
              ] })
            ] })
          ] }, r.id);
        }) : /* @__PURE__ */ jsx("p", { className: styles$f.noReviews, children: "Ende nuk ka vlerësime për këtë mjeshtër." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$f.mobileAction, children: /* @__PURE__ */ jsxs("div", { className: styles$f.mobileActionInner, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$f.mobilePricing, children: [
        /* @__PURE__ */ jsx("strong", { children: worker.startingPrice ? `${worker.startingPrice}€` : "Tarifa" }),
        /* @__PURE__ */ jsx("span", { children: "Fillon nga" })
      ] }),
      /* @__PURE__ */ jsx(
        WhatsAppButton,
        {
          workerId: worker.id,
          phoneNumber: worker.phoneNumber,
          workerName: worker.fullName,
          disabled
        }
      )
    ] }) })
  ] });
}
const container$6 = "_container_zci2w_3";
const centered = "_centered_zci2w_25";
const card$2 = "_card_zci2w_47";
const header$1 = "_header_zci2w_85";
const workerBadge = "_workerBadge_zci2w_125";
const workerImg = "_workerImg_zci2w_141";
const avatarPlaceholder = "_avatarPlaceholder_zci2w_159";
const workerName$2 = "_workerName_zci2w_185";
const form$2 = "_form_zci2w_199";
const inputGroup$2 = "_inputGroup_zci2w_211";
const textField = "_textField_zci2w_239";
const textareaField = "_textareaField_zci2w_239";
const ratingGroup = "_ratingGroup_zci2w_287";
const starRating = "_starRating_zci2w_303";
const starActive = "_starActive_zci2w_341";
const starInactive = "_starInactive_zci2w_343";
const verifySection = "_verifySection_zci2w_349";
const verifyLabel = "_verifyLabel_zci2w_361";
const phoneContainerCustom = "_phoneContainerCustom_zci2w_377";
const phoneInputCustom = "_phoneInputCustom_zci2w_385";
const submitBtn$1 = "_submitBtn_zci2w_403";
const loader = "_loader_zci2w_517";
const errorText = "_errorText_zci2w_539";
const successCard = "_successCard_zci2w_541";
const successIcon = "_successIcon_zci2w_543";
const styles$e = {
  container: container$6,
  centered,
  card: card$2,
  header: header$1,
  workerBadge,
  workerImg,
  avatarPlaceholder,
  workerName: workerName$2,
  form: form$2,
  inputGroup: inputGroup$2,
  textField,
  textareaField,
  ratingGroup,
  starRating,
  starActive,
  starInactive,
  verifySection,
  verifyLabel,
  phoneContainerCustom,
  phoneInputCustom,
  submitBtn: submitBtn$1,
  loader,
  errorText,
  successCard,
  successIcon
};
function ReviewPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error2, setError] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputPhone, setInputPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const tokenRef = doc(db, "reviewRequests", token);
        const snap = await getDoc(tokenRef);
        if (!snap.exists()) {
          setError("Link i pavlefshëm ose i skaduar.");
          return;
        }
        const data = snap.data();
        if (data.status === "used") {
          setError("Ky link është përdorur tashmë. Faleminderit për vlerësimin tuaj!");
          return;
        }
        setTokenData(data);
      } catch (err) {
        console.error(err);
        setError("Ndodhi një gabim gjatë ngarkimit të faqes.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);
  function handleCheckPhone() {
    const cleanInput = inputPhone.replace(/\D/g, "");
    const cleanTarget = tokenData.customerPhone.replace(/\D/g, "");
    if (cleanInput === cleanTarget || cleanInput.endsWith(cleanTarget) || cleanTarget.endsWith(cleanInput)) {
      setIsVerified(true);
      setError("");
      setPhoneError("");
    } else {
      setPhoneError("Numri nuk përputhet me kërkesën.");
      return;
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!tokenData || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const functions2 = getFunctions();
      const submitReviewFn = httpsCallable(functions2, "submitReview");
      await submitReviewFn({
        token,
        rating,
        comment: comment.trim(),
        customerName: customerName.trim(),
        inputPhone: inputPhone.replace(/\D/g, "")
        // Send clean phone to backend
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Transaction failed: ", err);
      setError(err.message || "Dështoi dërgimi i vlerësimit. Provoni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: styles$e.centered, children: [
      /* @__PURE__ */ jsx("div", { className: styles$e.loader }),
      /* @__PURE__ */ jsx("p", { className: styles$e.loadingText, children: "Duke u sinkronizuar..." })
    ] });
  }
  if (error2) {
    return /* @__PURE__ */ jsx("div", { className: styles$e.container, children: /* @__PURE__ */ jsxs("div", { className: styles$e.errorCard, children: [
      /* @__PURE__ */ jsx("span", { className: styles$e.errorIcon, children: "⚠️" }),
      /* @__PURE__ */ jsx("p", { className: styles$e.errorText, children: error2 }),
      /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: styles$e.retryBtn, children: "Provo përsëri" })
    ] }) });
  }
  if (submitted) {
    return /* @__PURE__ */ jsx("div", { className: styles$e.container, children: /* @__PURE__ */ jsxs("div", { className: `${styles$e.card} ${styles$e.successCard}`, children: [
      /* @__PURE__ */ jsx("div", { className: styles$e.successIcon, children: "🎉" }),
      /* @__PURE__ */ jsx("h2", { children: "Vlerësimi u dërgua!" }),
      /* @__PURE__ */ jsx("p", { children: "Faleminderit që ndihmoni komunitetin tonë të rritet." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.location.href = "/",
          className: styles$e.homeBtn,
          style: { marginTop: "2rem" },
          children: "Kthehu në Ballinë"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: styles$e.container, children: /* @__PURE__ */ jsxs("div", { className: styles$e.card, children: [
    /* @__PURE__ */ jsxs("header", { className: styles$e.header, children: [
      /* @__PURE__ */ jsx("h2", { children: "Lini një Vlerësim" }),
      /* @__PURE__ */ jsx("p", { children: "Eksperienca juaj me mjeshtrin:" }),
      /* @__PURE__ */ jsxs("div", { className: styles$e.workerBadge, children: [
        (tokenData == null ? void 0 : tokenData.workerPic) ? /* @__PURE__ */ jsx("img", { src: tokenData.workerPic, alt: "", className: styles$e.workerImg }) : /* @__PURE__ */ jsx("div", { className: styles$e.avatarPlaceholder, children: (tokenData == null ? void 0 : tokenData.workerName) ? tokenData.workerName[0] : "?" }),
        /* @__PURE__ */ jsx("span", { className: styles$e.workerName, children: tokenData == null ? void 0 : tokenData.workerName })
      ] })
    ] }),
    !isVerified ? (
      /* --- Step 1: Verification UI --- */
      /* @__PURE__ */ jsxs("div", { className: styles$e.verifySection, children: [
        /* @__PURE__ */ jsx("label", { className: styles$e.verifyLabel, children: "Verifikoni numrin e telefonit për të vazhduar:" }),
        /* @__PURE__ */ jsx("div", { className: styles$e.phoneWrapper, children: /* @__PURE__ */ jsx(
          PhoneInput,
          {
            country: "xk",
            value: inputPhone,
            onChange: setInputPhone,
            inputClass: styles$e.phoneInputCustom,
            containerClass: styles$e.phoneContainerCustom
          }
        ) }),
        phoneError && /* @__PURE__ */ jsx("p", { className: styles$e.phoneErrorText, children: phoneError }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleCheckPhone,
            className: styles$e.submitBtn,
            style: { marginTop: "1rem" },
            children: "Verifiko & Vazhdo"
          }
        )
      ] })
    ) : (
      /* --- Step 2: The Actual Review Form --- */
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: styles$e.form, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$e.ratingGroup, children: [
          /* @__PURE__ */ jsx("label", { style: { textAlign: "center", display: "block", color: "#888", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "8px" }, children: "Si do ta vlerësonit punën?" }),
          /* @__PURE__ */ jsx("div", { className: styles$e.starRating, children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: star <= (hover || rating) ? styles$e.starActive : styles$e.starInactive,
              onClick: () => setRating(star),
              onMouseEnter: () => setHover(star),
              onMouseLeave: () => setHover(0),
              children: "★"
            },
            star
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$e.inputGroup, children: [
          /* @__PURE__ */ jsx("label", { children: "Emri juaj (Opsionale)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: customerName,
              onChange: (e) => setCustomerName(e.target.value),
              placeholder: "Psh: Filan Fisteku",
              className: styles$e.textField
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$e.inputGroup, children: [
          /* @__PURE__ */ jsx("label", { children: "Komenti juaj" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: comment,
              onChange: (e) => setComment(e.target.value),
              placeholder: "Shpjegoni shkurtimisht çfarë ju pëlqeu...",
              required: true,
              className: styles$e.textareaField
            }
          )
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", className: styles$e.submitBtn, disabled: isSubmitting, children: isSubmitting ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }, children: [
          /* @__PURE__ */ jsx("div", { className: styles$e.loader, style: { width: "18px", height: "18px", borderWidth: "2px" } }),
          "Dërgimi..."
        ] }) : "Dërgo Vlerësimin" })
      ] })
    )
  ] }) });
}
const wrapper = "_wrapper_mi596_9";
const fadeIn = "_fadeIn_mi596_1";
const contactCard = "_contactCard_mi596_29";
const slideIn = "_slideIn_mi596_1";
const title$9 = "_title_mi596_53";
const subtitle$1 = "_subtitle_mi596_77";
const form$1 = "_form_mi596_93";
const row = "_row_mi596_105";
const inputGroup$1 = "_inputGroup_mi596_117";
const reveal = "_reveal_mi596_1";
const customSelect = "_customSelect_mi596_175";
const lockedInputWrapper = "_lockedInputWrapper_mi596_191";
const lockedInput = "_lockedInput_mi596_191";
const lockIcon$1 = "_lockIcon_mi596_217";
const helperText = "_helperText_mi596_231";
const selectWrapper = "_selectWrapper_mi596_247";
const footerRow = "_footerRow_mi596_305";
const submitBtn = "_submitBtn_mi596_319";
const statusMsg = "_statusMsg_mi596_369";
const success = "_success_mi596_379";
const error = "_error_mi596_381";
const styles$d = {
  wrapper,
  fadeIn,
  contactCard,
  slideIn,
  title: title$9,
  subtitle: subtitle$1,
  form: form$1,
  row,
  inputGroup: inputGroup$1,
  reveal,
  customSelect,
  lockedInputWrapper,
  lockedInput,
  lockIcon: lockIcon$1,
  helperText,
  selectWrapper,
  footerRow,
  submitBtn,
  statusMsg,
  success,
  error
};
function Contact() {
  const [result, setResult] = useState("");
  const [status2, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [searchParams] = useSearchParams();
  useEffect(() => {
    window.scroll(0, 0);
    const urlSubject = searchParams.get("subject");
    if (urlSubject) {
      setSubject(urlSubject);
    }
  }, [searchParams]);
  const onSubmit = async (event) => {
    var _a2;
    event.preventDefault();
    setResult("Duke u dërguar...");
    setStatus("loading");
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const commonReport = {
        reporterName: data.name,
        reporterEmail: data.email,
        reporterId: ((_a2 = auth.currentUser) == null ? void 0 : _a2.uid) || "Guest",
        title: data.title,
        message: data.message,
        category: data.subject,
        createdAt: serverTimestamp(),
        status: "open"
        // Helpful for admin to track resolved issues
      };
      if (data.subject === "Problem") {
        await addDoc(collection(db, "reports"), {
          ...commonReport,
          reportedUserName: data.reported_user_display || "N/A",
          reportedUserId: data.reported_id || "N/A"
        });
        setResult("Raporti u dërgua me sukses. Faleminderit!");
      } else {
        formData.append("access_key", "0eb38deb-61ed-4c8e-ac89-001194247faa");
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        const resData = await response.json();
        if (resData.success) {
          await addDoc(collection(db, "reports"), commonReport);
          setResult("Mesazhi u dërgua me sukses!");
        } else {
          throw new Error("Dërgimi dështoi nga Web3Forms");
        }
      }
      setStatus("success");
      setSubject("");
      event.target.reset();
    } catch (error2) {
      console.error("DETAJET E GABIMIT:", error2);
      setStatus("error");
      setResult("Pati një gabim. Provoni përsëri.");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: styles$d.wrapper, children: /* @__PURE__ */ jsxs("div", { className: styles$d.contactCard, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$d.header, children: [
      /* @__PURE__ */ jsxs("h2", { className: styles$d.title, children: [
        "Na ",
        /* @__PURE__ */ jsx("span", { children: "Kontaktoni" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: styles$d.subtitle, children: "Kemi krijuar këtë hapësirë për çdo pyetje apo sugjerim tuajin." })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit, className: styles$d.form, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$d.row, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$d.inputGroup, children: [
          /* @__PURE__ */ jsx("label", { children: "Emri Juaj" }),
          /* @__PURE__ */ jsx("input", { type: "text", name: "name", placeholder: "Filan Fisteku", required: true })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$d.inputGroup, children: [
          /* @__PURE__ */ jsx("label", { children: "Email" }),
          /* @__PURE__ */ jsx("input", { type: "email", name: "email", placeholder: "emri@shembull.com", required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$d.inputGroup, children: [
        /* @__PURE__ */ jsx("label", { children: "Kategoria" }),
        /* @__PURE__ */ jsx("div", { className: styles$d.selectWrapper, children: /* @__PURE__ */ jsxs(
          "select",
          {
            name: "subject",
            className: styles$d.customSelect,
            required: true,
            value: subject,
            onChange: (e) => setSubject(e.target.value),
            children: [
              /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Zgjidhni një kategori" }),
              /* @__PURE__ */ jsx("option", { value: "Pergjithshme", children: "Pyetje e përgjithshme" }),
              /* @__PURE__ */ jsx("option", { value: "Punetor", children: "Unë jam Punëtor" }),
              /* @__PURE__ */ jsx("option", { value: "Klient", children: "Unë jam Klient" }),
              /* @__PURE__ */ jsx("option", { value: "Problem", children: "Raporto Problem / Abuzim" })
            ]
          }
        ) })
      ] }),
      subject === "Problem" && /* @__PURE__ */ jsxs("div", { className: styles$d.inputGroup, style: { animation: "fadeIn 0.4s ease forwards" }, children: [
        /* @__PURE__ */ jsx("label", { children: "Personi që po raportoni" }),
        /* @__PURE__ */ jsxs("div", { className: styles$d.lockedInputWrapper, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "reported_user_display",
              defaultValue: searchParams.get("reported_name") || "I panjohur",
              readOnly: true,
              className: styles$d.lockedInput
            }
          ),
          /* @__PURE__ */ jsx("span", { className: styles$d.lockIcon, children: "🔒" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "reported_id",
            value: searchParams.get("reported_id") || ""
          }
        ),
        /* @__PURE__ */ jsx("p", { className: styles$d.helperText, children: "*ID e punëtorit është lidhur automatikisht." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$d.inputGroup, children: [
        /* @__PURE__ */ jsx("label", { children: "Subjekti i mesazhit" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "title",
            placeholder: subject === "Problem" ? "Psh: Sjellje jo profesionale" : "Psh: Ndihmë me llogarinë",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$d.inputGroup, children: [
        /* @__PURE__ */ jsx("label", { children: "Mesazhi juaj" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "message",
            rows: "5",
            placeholder: "Shkruani detajet këtu...",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$d.footerRow, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: styles$d.submitBtn,
            disabled: status2 === "loading",
            children: status2 === "loading" ? "Duke u dërguar..." : subject === "Problem" ? "Dërgo Raportin" : "Dërgo Mesazhin"
          }
        ),
        result && /* @__PURE__ */ jsxs("p", { className: `${styles$d.statusMsg} ${styles$d[status2]}`, children: [
          status2 === "success" ? "✅ " : status2 === "error" ? "❌ " : "",
          " ",
          result
        ] })
      ] })
    ] })
  ] }) });
}
const container$5 = "_container_muyn4_1";
const title$8 = "_title_muyn4_15";
const leadText$3 = "_leadText_muyn4_39";
const contentSection$3 = "_contentSection_muyn4_57";
const date$2 = "_date_muyn4_103";
const styles$c = {
  container: container$5,
  title: title$8,
  leadText: leadText$3,
  contentSection: contentSection$3,
  date: date$2
};
function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: styles$c.container, children: [
    /* @__PURE__ */ jsxs("h1", { className: styles$c.title, children: [
      "Politika e ",
      /* @__PURE__ */ jsx("span", { children: "Privatësisë" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$c.contentSection, children: [
      /* @__PURE__ */ jsxs("p", { className: styles$c.leadText, children: [
        "Mirë se vini në ",
        /* @__PURE__ */ jsx("strong", { children: "GjejNjerin.com" }),
        ". Ne e respektojmë privatësinë tuaj dhe jemi të përkushtuar për mbrojtjen e të dhënave personale të çdo përdoruesi, përfshirë Ustahët dhe Klientët. Duke përdorur platformën tonë, ju pranoni praktikat e përshkruara në këtë Politikë Privatësie."
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "1. Të Dhënat që Mbledhim" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Emri dhe mbiemri" }),
        /* @__PURE__ */ jsx("li", { children: "Numri i telefonit" }),
        /* @__PURE__ */ jsx("li", { children: "Lokacioni (Qyteti / Zona)" }),
        /* @__PURE__ */ jsx("li", { children: "Kategoria e shërbimit" }),
        /* @__PURE__ */ jsx("li", { children: "Foto profili (nëse ngarkohet)" }),
        /* @__PURE__ */ jsx("li", { children: "Vlerësime dhe komente nga klientët" }),
        /* @__PURE__ */ jsx("li", { children: "Të dhëna teknike si IP adresa, pajisja dhe shfletuesi" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Ne mbledhim vetëm të dhëna që janë të nevojshme për funksionimin dhe përmirësimin e platformës." }),
      /* @__PURE__ */ jsx("h3", { children: "2. Si i Përdorim të Dhënat Tuaja" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Shfaqjen e profilit tuaj në rezultatet e kërkimit dhe Live Ranking" }),
        /* @__PURE__ */ jsx("li", { children: "Lidhjen e klientëve me profesionistët" }),
        /* @__PURE__ */ jsx("li", { children: "Dërgimin e njoftimeve për vlerësime ose kërkesa për punë" }),
        /* @__PURE__ */ jsx("li", { children: "Përmirësimin e sigurisë dhe performancës së platformës" }),
        /* @__PURE__ */ jsx("li", { children: "Parandalimin e mashtrimeve dhe abuzimeve" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Ne nuk i përdorim të dhënat tuaja për marketing pa pëlqimin tuaj." }),
      /* @__PURE__ */ jsx("h3", { children: "3. Shfaqja e Numrit të Telefonit" }),
      /* @__PURE__ */ jsx("p", { children: "Numri i telefonit i Mjeshtërve shfaqet si pjesë e shërbimit të platformës për t’u mundësuar klientëve kontakt direkt. Ne nuk i shesim apo shpërndajmë të dhënat tuaja personale tek palë të treta për qëllime marketingu." }),
      /* @__PURE__ */ jsx("h3", { children: "4. Ruajtja dhe Siguria e të Dhënave" }),
      /* @__PURE__ */ jsx("p", { children: "Ne përdorim masa teknike dhe organizative për të mbrojtur të dhënat tuaja nga aksesi i paautorizuar, ndryshimi, zbulimi apo humbja. Megjithatë, asnjë sistem online nuk është 100% i sigurt." }),
      /* @__PURE__ */ jsx("h3", { children: "5. Cookies" }),
      /* @__PURE__ */ jsx("p", { children: "Platforma mund të përdorë cookies për ruajtjen e sesionit, analiza statistikore dhe përmirësimin e eksperiencës së përdoruesit. Ju mund t’i çaktivizoni cookies përmes shfletuesit tuaj." }),
      /* @__PURE__ */ jsx("h3", { children: "6. Të Drejtat Tuaja" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Të kërkoni qasje në të dhënat tuaja" }),
        /* @__PURE__ */ jsx("li", { children: "Të kërkoni korrigjimin e tyre" }),
        /* @__PURE__ */ jsx("li", { children: "Të kërkoni fshirjen e llogarisë dhe të dhënave" }),
        /* @__PURE__ */ jsx("li", { children: "Të tërhiqni pëlqimin për përpunim të të dhënave" })
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Për çdo kërkesë mund të na kontaktoni në:",
        " ",
        /* @__PURE__ */ jsx("a", { href: "mailto:info@gjejmjeshtrin.ks", children: "info@gjejmjeshtrin.ks" })
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "7. Fëmijët" }),
      /* @__PURE__ */ jsx("p", { children: "Platforma nuk është e destinuar për persona nën moshën 18 vjeç." }),
      /* @__PURE__ */ jsx("h3", { children: "8. Ndryshimet në Politikë" }),
      /* @__PURE__ */ jsx("p", { children: "Ne mund ta përditësojmë këtë politikë herë pas here. Çdo ndryshim do të publikohet në këtë faqe me datën e përditësimit." }),
      /* @__PURE__ */ jsx("div", { className: styles$c.date, children: "E përditësuar së fundmi: Mars 2026" })
    ] })
  ] });
}
const container$4 = "_container_qxb1y_3";
const title$7 = "_title_qxb1y_25";
const date$1 = "_date_qxb1y_49";
const leadText$2 = "_leadText_qxb1y_63";
const contentSection$2 = "_contentSection_qxb1y_81";
const styles$b = {
  container: container$4,
  title: title$7,
  date: date$1,
  leadText: leadText$2,
  contentSection: contentSection$2
};
function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: styles$b.container, children: [
    /* @__PURE__ */ jsxs("h1", { className: styles$b.title, children: [
      "Kushtet e ",
      /* @__PURE__ */ jsx("span", { children: "Përdorimit" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$b.contentSection, children: [
      /* @__PURE__ */ jsx("p", { className: styles$b.date, children: "Përditësuar së fundmi: Mars 2026" }),
      /* @__PURE__ */ jsxs("p", { className: styles$b.leadText, children: [
        "Mirë se vini në ",
        /* @__PURE__ */ jsx("strong", { children: "GjejNjerin.com" }),
        ". Duke përdorur platformën tonë, ju pranoni këto Kushte Përdorimi. Nëse nuk pajtoheni me to, ju lutemi mos përdorni platformën."
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "1. Pranimi i Kushteve" }),
      /* @__PURE__ */ jsx("p", { children: "Duke krijuar llogari ose duke përdorur shërbimet tona, ju konfirmoni se jeni mbi 18 vjeç dhe pranoni të respektoni të gjitha rregullat e platformës." }),
      /* @__PURE__ */ jsx("h3", { children: "2. Roli i Platformës" }),
      /* @__PURE__ */ jsx("p", { children: "GjejNjerin.com është një platformë ndërlidhëse që lidh klientët me profesionistët (Ustahët). Ne nuk jemi punëdhënës, agjenci punësimi apo garantues i cilësisë së punës së kryer." }),
      /* @__PURE__ */ jsx("p", { children: "Marrëveshjet për çmimin, kohën dhe realizimin e punës bëhen drejtpërdrejt mes klientit dhe Ustahut." }),
      /* @__PURE__ */ jsx("h3", { children: "3. Përgjegjësia e Mjeshtrit" }),
      /* @__PURE__ */ jsx("p", { children: "Çdo Mjeshtër është përgjegjës për saktësinë e të dhënave, përvojës, fotografive dhe shërbimeve të publikuara në profil. Informacioni i rremë ose mashtrues mund të çojë në pezullim ose mbyllje të llogarisë." }),
      /* @__PURE__ */ jsx("h3", { children: "4. Vlerësimet dhe Komentet" }),
      /* @__PURE__ */ jsx("p", { children: "Klientët mund të lënë vlerësime bazuar në përvojën reale. Abuzimi me sistemin e reviews, manipulimi i vlerësimeve ose përmbajtja ofenduese nuk lejohet." }),
      /* @__PURE__ */ jsx("p", { children: "Ne rezervojmë të drejtën të fshijmë komente që përmbajnë gjuhë fyese, kërcënuese ose të pavërteta." }),
      /* @__PURE__ */ jsx("h3", { children: "5. Sjellja e Ndaluar" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Publikimi i informacionit të rremë" }),
        /* @__PURE__ */ jsx("li", { children: "Përdorimi i platformës për aktivitete të paligjshme" }),
        /* @__PURE__ */ jsx("li", { children: "Abuzimi me përdorues të tjerë" }),
        /* @__PURE__ */ jsx("li", { children: "Spam, mashtrime ose manipulim i sistemit" })
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "6. Kufizimi i Përgjegjësisë" }),
      /* @__PURE__ */ jsx("p", { children: "Gjejmjeshtrin.ks nuk mban përgjegjësi për dëme, humbje financiare, mosmarrëveshje apo probleme që lindin nga marrëveshjet mes klientëve dhe Ustahëve." }),
      /* @__PURE__ */ jsx("p", { children: "Përdorimi i platformës bëhet me përgjegjësi të plotë nga përdoruesi." }),
      /* @__PURE__ */ jsx("h3", { children: "7. Pezullimi dhe Mbyllja e Llogarisë" }),
      /* @__PURE__ */ jsx("p", { children: "Ne rezervojmë të drejtën të pezullojmë ose mbyllim çdo llogari që shkel këto kushte, pa paralajmërim paraprak." }),
      /* @__PURE__ */ jsx("h3", { children: "8. Ndryshimet në Kushtet" }),
      /* @__PURE__ */ jsx("p", { children: "GjejNjerin.com mund të përditësojë këto Kushte Përdorimi në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë pas publikimit." }),
      /* @__PURE__ */ jsx("h3", { children: "9. Ligji i Aplikueshëm" }),
      /* @__PURE__ */ jsx("p", { children: "Këto kushte rregullohen sipas legjislacionit në fuqi në Republikën e Kosovës." })
    ] })
  ] });
}
const container$3 = "_container_cvsas_1";
const heroTitle$1 = "_heroTitle_cvsas_23";
const leadText$1 = "_leadText_cvsas_47";
const contentSection$1 = "_contentSection_cvsas_65";
const gridFeatures = "_gridFeatures_cvsas_101";
const feature = "_feature_cvsas_115";
const styles$a = {
  container: container$3,
  heroTitle: heroTitle$1,
  leadText: leadText$1,
  contentSection: contentSection$1,
  gridFeatures,
  feature
};
function About() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: styles$a.container, children: [
    /* @__PURE__ */ jsxs("h1", { className: styles$a.heroTitle, children: [
      "Misioni ynë: ",
      /* @__PURE__ */ jsx("span", { children: "GjejNjerin" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: styles$a.leadText, children: "Në një treg ku koha është flori, ne kemi krijuar urën lidhëse mes Njeriut profesionist dhe klientit që ka nevojë për zgjidhje të shpejta dhe të besueshme." }),
    /* @__PURE__ */ jsxs("div", { className: styles$a.contentSection, children: [
      /* @__PURE__ */ jsx("h2", { children: "Pse GjejNjerin.com" }),
      /* @__PURE__ */ jsx("p", { children: "Ideja lindi nga një nevojë e thjeshtë: vështirësia për të gjetur një mjeshtër të besueshëm në Kosovë pa pasur nevojë të pyesësh të gjithë rrethin shoqëror. Ne besojmë se teknologjia duhet t'u shërbejë njerëzve të punës dhe të rrisë vlerën e zanatit." }),
      /* @__PURE__ */ jsxs("div", { className: styles$a.gridFeatures, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$a.feature, children: [
          /* @__PURE__ */ jsx("h3", { children: "Për Mjeshtrit" }),
          /* @__PURE__ */ jsx("p", { children: "Një hapësirë ku puna juaj vlerësohet, ku renditja bëhet në mënyrë transparente dhe ku klientët ju gjejnë direkt." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$a.feature, children: [
          /* @__PURE__ */ jsx("h3", { children: "Për Klientët" }),
          /* @__PURE__ */ jsx("p", { children: "Siguri, transparencë dhe mundësia për të parë vlerësimet reale për të zgjedhur më të mirin për projektin tuaj." })
        ] })
      ] })
    ] })
  ] });
}
const helpContainer = "_helpContainer_1ebsw_9";
const header = "_header_1ebsw_35";
const faqSection = "_faqSection_1ebsw_71";
const faqItem = "_faqItem_1ebsw_83";
const faqQuestion = "_faqQuestion_1ebsw_115";
const icon = "_icon_1ebsw_145";
const active = "_active_1ebsw_159";
const faqAnswer = "_faqAnswer_1ebsw_167";
const contactSupport = "_contactSupport_1ebsw_215";
const supportCard = "_supportCard_1ebsw_225";
const supportButtons = "_supportButtons_1ebsw_295";
const emailBtn = "_emailBtn_1ebsw_307";
const title$6 = "_title_1ebsw_343";
const supportTitle = "_supportTitle_1ebsw_367";
const styles$9 = {
  helpContainer,
  header,
  faqSection,
  faqItem,
  faqQuestion,
  icon,
  active,
  faqAnswer,
  contactSupport,
  supportCard,
  supportButtons,
  emailBtn,
  title: title$6,
  supportTitle
};
const faqs = [
  {
    question: "Si funksionon sistemi i vlerësimeve?",
    answer: "Sistemi ynë bazohet në vërtetësi. Në Dashboard, ju gjeneroni një link unik për vlerësim. Kur klienti klikon linkun, ai verifikohet përmes WhatsApp-it për të lënë vlerësimin. Kjo siguron që çdo yll në profilin tuaj të jetë nga një person real dhe punë e vërtetë."
  },
  {
    question: "Çfarë përfitimesh ka statusi PRO?",
    answer: "Anëtarët PRO renditen gjithmonë në krye të kërkimeve (Top Ranking), marrin distinktivin 'PRO' që rrit besimin te klientët, dhe shfaqen në faqen kryesore si 'Mjeshtër të Rekomanduar'. Gjithashtu, profilet PRO kanë akses në statistika të detajuara të shikueshmërisë."
  },
  {
    question: "Pse është i rëndësishëm verifikimi me WhatsApp?",
    answer: "Ne duam të shmangim vlerësimet e rreme. Duke përdorur WhatsApp, ne sigurohemi që personi që po ju vlerëson është një klient real. Ky proces rrit prestigjin tuaj dhe i jep siguri çdo klienti të ri që viziton profilin tuaj."
  },
  {
    question: "Si mund të shfaqem në faqen kryesore (Featured)?",
    answer: "Faqja kryesore është e rezervuar për Mjeshtrit PRO që kanë vlerësime pozitive aktive. Sistemi ynë përzgjedh automatikisht mjeshtrit më aktivë dhe me vlerësimet më të larta për t'i promovuar te vizitorët e rinj."
  },
  {
    question: "A mund të fshij një vlerësim që nuk më pëlqen?",
    answer: "Për të ruajtur integritetin e platformës, vlerësimet nuk mund të fshihen nga mjeshtri. Megjithatë, nëse mendoni se një vlerësim është abuziv ose i pavërtetë, mund të kontaktoni suportin tonë për një rishikim manual të rastit."
  },
  {
    question: "Si të bëhem pjesë e listës së të preferuarve (Favorites)?",
    answer: "Klientët mund t'ju shtojnë në listën e tyre të preferuar duke klikuar ikonën e zemrës në profilin tuaj. Kjo i lejon ata t'ju gjejnë shpejt pa pasur nevojë të kërkojnë përsëri në listën e madhe të mjeshtërve."
  },
  {
    question: "Sa kushton shërbimi?",
    answer: "Regjistrimi dhe krijimi i profilit është plotësisht FALAS. Ne besojmë në mbështetjen e mjeshtërve vendorë. Opsioni PRO është një investim minimal për ata që duan të rrisin xhiron e punës përmes reklamimit prioritar."
  }
];
function Help() {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$9.helpContainer, children: [
    /* @__PURE__ */ jsxs("header", { className: styles$9.header, children: [
      /* @__PURE__ */ jsxs("h1", { className: styles$9.title, children: [
        "Si mund t'ju ",
        /* @__PURE__ */ jsx("span", { children: "ndihmojmë?" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Gjeni përgjigjet për pyetjet më të shpeshta rreth platformës sonë." })
    ] }),
    /* @__PURE__ */ jsx("section", { className: styles$9.faqSection, children: faqs.map((faq, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${styles$9.faqItem} ${activeIndex === index ? styles$9.active : ""}`,
        onClick: () => toggleAccordion(index),
        children: [
          /* @__PURE__ */ jsxs("div", { className: styles$9.faqQuestion, children: [
            /* @__PURE__ */ jsx("h3", { children: faq.question }),
            /* @__PURE__ */ jsx("span", { className: styles$9.icon, children: activeIndex === index ? "−" : "+" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: styles$9.faqAnswer, children: /* @__PURE__ */ jsx("p", { children: faq.answer }) })
        ]
      },
      index
    )) }),
    /* @__PURE__ */ jsx("section", { className: styles$9.contactSupport, children: /* @__PURE__ */ jsxs("div", { className: styles$9.supportCard, children: [
      /* @__PURE__ */ jsxs("h3", { className: styles$9.supportTitle, children: [
        "Nuk gjetët atë që ",
        /* @__PURE__ */ jsx("span", { children: "kërkonit?" })
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Na shkruani një mesazh dhe ekipi ynë do t'ju kthejë përgjigje sa më shpejt të jetë e mundur." }),
      /* @__PURE__ */ jsx("div", { className: styles$9.supportButtons, children: /* @__PURE__ */ jsx(Link, { to: "/contact", className: styles$9.emailBtn, children: "Dërgo një Mesazh" }) })
    ] }) })
  ] });
}
const adminWrapper = "_adminWrapper_1i4ok_1";
const tableContainer$3 = "_tableContainer_1i4ok_103";
const adminTable$3 = "_adminTable_1i4ok_119";
const nameCell$1 = "_nameCell_1i4ok_165";
const badgePro = "_badgePro_1i4ok_197";
const badgeBasic$1 = "_badgeBasic_1i4ok_197";
const actionCell = "_actionCell_1i4ok_233";
const buttonGroup = "_buttonGroup_1i4ok_241";
const adminBtn = "_adminBtn_1i4ok_255";
const addProBtn = "_addProBtn_1i4ok_293";
const removeProBtn = "_removeProBtn_1i4ok_305";
const suspendBtn = "_suspendBtn_1i4ok_317";
const activateBtn = "_activateBtn_1i4ok_329";
const deleteBtn$3 = "_deleteBtn_1i4ok_341";
const inlineMetaTime = "_inlineMetaTime_1i4ok_377";
const proTimeBadge = "_proTimeBadge_1i4ok_399";
const detailsBtn = "_detailsBtn_1i4ok_419";
const modalOverlay = "_modalOverlay_1i4ok_441";
const modalContent = "_modalContent_1i4ok_471";
const modalHeader = "_modalHeader_1i4ok_497";
const closeModalBtn = "_closeModalBtn_1i4ok_527";
const modalBody = "_modalBody_1i4ok_555";
const infoSection = "_infoSection_1i4ok_573";
const infoGrid = "_infoGrid_1i4ok_609";
const fullWidthGridItem = "_fullWidthGridItem_1i4ok_637";
const bioBlock = "_bioBlock_1i4ok_645";
const codeSnippet = "_codeSnippet_1i4ok_689";
const styles$8 = {
  adminWrapper,
  tableContainer: tableContainer$3,
  adminTable: adminTable$3,
  nameCell: nameCell$1,
  badgePro,
  badgeBasic: badgeBasic$1,
  actionCell,
  buttonGroup,
  adminBtn,
  addProBtn,
  removeProBtn,
  suspendBtn,
  activateBtn,
  deleteBtn: deleteBtn$3,
  inlineMetaTime,
  proTimeBadge,
  detailsBtn,
  modalOverlay,
  modalContent,
  modalHeader,
  closeModalBtn,
  modalBody,
  infoSection,
  infoGrid,
  fullWidthGridItem,
  bioBlock,
  codeSnippet
};
function AdminWorkers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "workers"),
        where("searchName", ">=", term),
        where("searchName", "<=", term + "")
      );
      const querySnapshot = await getDocs(q);
      const workers = querySnapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data()
      }));
      setResults(workers);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };
  async function handleTogglePro(id, isPro) {
    try {
      const workerRef = doc(db, "workers", id);
      const statsRef = doc(db, "metadata", "globalStats");
      await updateDoc(workerRef, { isPro: !isPro });
      await updateDoc(statsRef, {
        proCount: isPro ? increment(-1) : increment(1)
      });
      setResults(results.map(
        (w) => w.id === id ? { ...w, isPro: !isPro } : w
      ));
      if (selectedWorker && selectedWorker.id === id) {
        setSelectedWorker((prev) => ({ ...prev, isPro: !isPro }));
      }
    } catch (e) {
      console.error("Gabim!", e);
    }
  }
  async function handleSuspend(id, isSuspended) {
    try {
      const workerRef = doc(db, "workers", id);
      const newSuspendedStatus = !isSuspended;
      await updateDoc(workerRef, {
        isSuspended: newSuspendedStatus
      });
      setResults(
        (prev) => prev.map(
          (w) => w.id === id ? { ...w, isSuspended: newSuspendedStatus } : w
        )
      );
      if ((selectedWorker == null ? void 0 : selectedWorker.id) === id) {
        setSelectedWorker((prev) => ({
          ...prev,
          isSuspended: newSuspendedStatus
        }));
      }
    } catch (err) {
      console.error("Gabim!", err);
    }
  }
  async function handleVerification(id, isVerified) {
    try {
      const workerRef = doc(db, "workers", id);
      await updateDoc(workerRef, {
        isVerified: !isVerified
      });
      setResults(results.map(
        (w) => w.id === id ? { ...w, isVerified: !isVerified } : w
      ));
      if (selectedWorker && selectedWorker.id === id) {
        setSelectedWorker((prev) => ({ ...prev, isVerified: !isVerified }));
      }
    } catch (err) {
      console.error("Gabim!", err);
    }
  }
  async function handleDelete(worker) {
    const { id, isPro, fullName } = worker;
    const confirmDelete = window.confirm(`A jeni i sigurt që dëshironi të fshini ${fullName}?`);
    if (!confirmDelete) return;
    try {
      const workerRef = doc(db, "workers", id);
      const statsRef = doc(db, "metadata", "globalStats");
      await deleteDoc(workerRef);
      const statsUpdate = {
        workerCount: increment(-1)
      };
      if (isPro) {
        statsUpdate.proCount = increment(-1);
      }
      await updateDoc(statsRef, statsUpdate);
      setResults((prevResults) => prevResults.filter((w) => w.id !== id));
      if (selectedWorker && selectedWorker.id === id) setSelectedWorker(null);
      alert("Mjeshtri u fshi me sukses");
    } catch (err) {
      console.error("Gabim gjatë fshirjes:", err);
      alert("Nuk keni autorizim ose ndodhi një gabim.");
    }
  }
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date2 = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date2.toLocaleString("sq-AL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$8.adminWrapper, children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "Shkruaj emrin e plotë..."
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, children: loading ? "Duke kërkuar..." : "Kërko" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: styles$8.resultsList, children: [
      /* @__PURE__ */ jsx("div", { className: styles$8.tableContainer, children: /* @__PURE__ */ jsxs("table", { className: styles$8.adminTable, children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { children: "Mjeshtri" }),
          /* @__PURE__ */ jsx("th", { children: "Kategoria" }),
          /* @__PURE__ */ jsx("th", { children: "Qyteti" }),
          /* @__PURE__ */ jsx("th", { children: "Statusi" }),
          /* @__PURE__ */ jsx("th", { children: "Veprimet" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: results.map((worker) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: styles$8.nameCell, children: [
            /* @__PURE__ */ jsx("strong", { children: worker.fullName }),
            /* @__PURE__ */ jsx("span", { className: styles$8.workerEmail, children: worker.email }),
            /* @__PURE__ */ jsxs("span", { children: [
              "ID: ",
              worker.id.substring(0, 5),
              "..."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$8.inlineMetaTime, children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "📅 Krijuar: ",
                formatTimestamp(worker.createdAt)
              ] }),
              worker.isPro && worker.proSubscribedAt && /* @__PURE__ */ jsxs("span", { className: styles$8.proTimeBadge, children: [
                "✨ PRO që nga: ",
                formatTimestamp(worker.proSubscribedAt)
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { children: worker.category }),
          /* @__PURE__ */ jsx("td", { children: worker.city || "N/A" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: worker.isPro ? styles$8.badgePro : styles$8.badgeBasic, children: worker.isPro ? "PRO" : "Basic" }) }),
          /* @__PURE__ */ jsx("td", { className: styles$8.actionCell, children: /* @__PURE__ */ jsxs("div", { className: styles$8.buttonGroup, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleVerification(worker.id, worker.isVerified),
                className: `${styles$8.adminBtn} ${worker.isVerified ? styles$8.unverifyBtn : styles$8.verifyBtn}`,
                title: worker.isVerified ? "Hiqe Verifikimin" : "Verifiko Punëtorin",
                children: worker.isVerified ? "🛡️ I Verifikuar" : "🔍 Verifiko"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleTogglePro(worker.id, worker.isPro),
                className: `${styles$8.adminBtn} ${worker.isPro ? styles$8.removeProBtn : styles$8.addProBtn}`,
                title: worker.isPro ? "Hiqe statusin PRO" : "Bëje PRO",
                children: worker.isPro ? "⭐ Hiqe Pro" : "✨ Bëje Pro"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleSuspend(worker.id, worker.isSuspended),
                className: `${styles$8.adminBtn} ${worker.isActive ? styles$8.suspendBtn : styles$8.activateBtn}`,
                children: worker.isActive ? "🚫 Suspend" : "✅ Aktivizo"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(worker),
                className: `${styles$8.adminBtn} ${styles$8.deleteBtn}`,
                children: "🗑️ Fshij"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSelectedWorker(worker),
                className: `${styles$8.adminBtn} ${styles$8.detailsBtn}`,
                title: "Shiko Detajet e Plota",
                children: "•••"
              }
            )
          ] }) })
        ] }, worker.id)) })
      ] }) }),
      !loading && searchTerm && results.length === 0 && /* @__PURE__ */ jsxs("p", { children: [
        'Asnjë rezultat u gjet për "',
        searchTerm,
        '"'
      ] })
    ] }),
    selectedWorker && /* @__PURE__ */ jsx("div", { className: styles$8.modalOverlay, onClick: () => setSelectedWorker(null), children: /* @__PURE__ */ jsxs("div", { className: styles$8.modalContent, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: styles$8.modalHeader, children: [
        /* @__PURE__ */ jsx("h2", { children: "Profili i Plotë i Mjeshtrit" }),
        /* @__PURE__ */ jsx("button", { className: styles$8.closeModalBtn, onClick: () => setSelectedWorker(null), children: "×" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$8.modalBody, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$8.infoSection, children: [
          /* @__PURE__ */ jsx("h3", { children: "🔑 Informacioni Bazik" }),
          /* @__PURE__ */ jsxs("div", { className: styles$8.infoGrid, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Emri i Plotë:" }),
              " ",
              selectedWorker.fullName
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Slug:" }),
              " ",
              selectedWorker.slug || "N/A"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "UID (Firebase):" }),
              " ",
              selectedWorker.uid
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Email:" }),
              " ",
              selectedWorker.email
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Numri i Telefonit:" }),
              " ",
              selectedWorker.phoneNumber || "N/A"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Qyteti:" }),
              " ",
              selectedWorker.city || "N/A"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$8.infoSection, children: [
          /* @__PURE__ */ jsx("h3", { children: "🛠️ Specifikacionet Profesionale" }),
          /* @__PURE__ */ jsxs("div", { className: styles$8.infoGrid, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Kategoria:" }),
              " ",
              selectedWorker.category
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Përvoja:" }),
              " ",
              selectedWorker.experienceYears,
              " Vite"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Çmimi Fillestar:" }),
              " ",
              selectedWorker.startingPrice,
              " €"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Përgjigje e Shpejtë:" }),
              " ",
              selectedWorker.quickResponse ? "Po" : "Jo"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "I Disponueshëm:" }),
              " ",
              selectedWorker.isAvailable ? "Po ✅" : "Jo ❌"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$8.bioBlock, children: [
            /* @__PURE__ */ jsx("strong", { children: "Biografia / Përshkrimi:" }),
            /* @__PURE__ */ jsx("p", { children: selectedWorker.bio || "Nuk ka biografi të shkruar..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$8.infoSection, children: [
          /* @__PURE__ */ jsx("h3", { children: "📊 Statistikat & Metrikat" }),
          /* @__PURE__ */ jsxs("div", { className: styles$8.infoGrid, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Vlerësimi Mesatar:" }),
              " ⭐ ",
              selectedWorker.avgRating !== null ? selectedWorker.avgRating : "0"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Numri i Rishikimeve:" }),
              " ",
              selectedWorker.reviewCount
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Klikime në WhatsApp:" }),
              " ",
              selectedWorker.whatsappRequests
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Rishikimi i Fundit më:" }),
              " ",
              formatTimestamp(selectedWorker.lastReviewAt)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$8.infoSection, children: [
          /* @__PURE__ */ jsx("h3", { children: "🛡️ Statusi Administrativ & Siguria" }),
          /* @__PURE__ */ jsxs("div", { className: styles$8.infoGrid, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Statusi i Llogarisë:" }),
              " ",
              selectedWorker.isActive ? "Aktive ✅" : "E Suspenduar 🚫"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "I Verifikuar:" }),
              " ",
              selectedWorker.isVerified ? "Po 🛡️" : "Jo 🔍"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Verifikimi i Refuzuar:" }),
              " ",
              selectedWorker.verificationRejected ? "Po ❌" : "Jo"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Plan Anëtarësimi:" }),
              " ",
              selectedWorker.isPro ? "PRO ⭐" : "Basic"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Ylli PRO i Shfaqur:" }),
              " ",
              selectedWorker.showProStar ? "Po" : "Jo"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "I Rekomanduar (Featured):" }),
              " ",
              selectedWorker.isFeatured ? "Po 🔥" : "Jo"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$8.fullWidthGridItem, children: [
              /* @__PURE__ */ jsx("strong", { children: "Gjurmë Digjitale (Fingerprint):" }),
              " ",
              /* @__PURE__ */ jsx("code", { className: styles$8.codeSnippet, children: selectedWorker.lastFingerprint || "Pa të dhëna" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$8.infoSection, children: [
          /* @__PURE__ */ jsx("h3", { children: "⏳ Historiku i Kohës" }),
          /* @__PURE__ */ jsxs("div", { className: styles$8.infoGrid, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Regjistrimi në Platformë:" }),
              " ",
              formatTimestamp(selectedWorker.createdAt)
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Abonimi PRO:" }),
              " ",
              formatTimestamp(selectedWorker.proSubscribedAt)
            ] })
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
const adminSection$2 = "_adminSection_iv6st_3";
const tableHeader$2 = "_tableHeader_iv6st_13";
const title$5 = "_title_iv6st_27";
const filterArea = "_filterArea_iv6st_41";
const filterLabel = "_filterLabel_iv6st_55";
const tableContainer$2 = "_tableContainer_iv6st_79";
const adminTable$2 = "_adminTable_iv6st_95";
const resolvedRow = "_resolvedRow_iv6st_143";
const nameCell = "_nameCell_iv6st_163";
const subText$2 = "_subText_iv6st_175";
const idBadge = "_idBadge_iv6st_185";
const naText = "_naText_iv6st_203";
const badgeColumn = "_badgeColumn_iv6st_215";
const badgeBasic = "_badgeBasic_iv6st_227";
const Problem = "_Problem_iv6st_251";
const statusOpen = "_statusOpen_iv6st_261";
const statusResolved = "_statusResolved_iv6st_273";
const messageCell = "_messageCell_iv6st_287";
const reportTitle = "_reportTitle_iv6st_295";
const messageScroll = "_messageScroll_iv6st_309";
const btnColumn = "_btnColumn_iv6st_329";
const replyBtn = "_replyBtn_iv6st_341";
const resolveBtn = "_resolveBtn_iv6st_371";
const reopenBtn = "_reopenBtn_iv6st_371";
const deleteBtn$2 = "_deleteBtn_iv6st_397";
const noResults$2 = "_noResults_iv6st_427";
const styles$7 = {
  adminSection: adminSection$2,
  tableHeader: tableHeader$2,
  title: title$5,
  filterArea,
  filterLabel,
  tableContainer: tableContainer$2,
  adminTable: adminTable$2,
  resolvedRow,
  nameCell,
  subText: subText$2,
  idBadge,
  naText,
  badgeColumn,
  badgeBasic,
  Problem,
  statusOpen,
  statusResolved,
  messageCell,
  reportTitle,
  messageScroll,
  btnColumn,
  replyBtn,
  resolveBtn,
  reopenBtn,
  deleteBtn: deleteBtn$2,
  noResults: noResults$2
};
function AdminReports({ user }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const docsRef = collection(db, "reports");
    const q = query(docsRef, orderBy("createdAt", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportList = querySnapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data()
      }));
      setResults(reportList);
      setLoading(false);
    }, (err) => {
      console.error("Gabim gjatë marrjes së të dhënave:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);
  const handleResolveReport = async (id, currentStatus) => {
    try {
      const reportRef = doc(db, "reports", id);
      const newStatus = currentStatus === "open" ? "resolved" : "open";
      await updateDoc(reportRef, { status: newStatus });
    } catch (err) {
      console.error("Gabim gjatë përditësimit:", err);
      alert("Dështoi ndryshimi i statusit.");
    }
  };
  const handlePermanentDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë raport përgjithmonë nga baza e të dhënave?")) return;
    try {
      await deleteDoc(doc(db, "reports", id));
    } catch (err) {
      console.error("Gabim gjatë fshirjes:", err);
      alert("Dështoi fshirja e raportit.");
    }
  };
  const displayedReports = filterOpen ? results.filter((r) => r.status === "open") : results;
  if (loading) return /* @__PURE__ */ jsx("div", { className: styles$7.loader, children: "Duke ngarkuar raportet..." });
  return /* @__PURE__ */ jsxs("div", { className: styles$7.adminSection, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$7.tableHeader, children: [
      /* @__PURE__ */ jsx("h2", { className: styles$7.title, children: "Menaxhimi i Raporteve" }),
      /* @__PURE__ */ jsx("div", { className: styles$7.filterArea, children: /* @__PURE__ */ jsxs("label", { className: styles$7.filterLabel, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: filterOpen,
            onChange: () => setFilterOpen(!filterOpen)
          }
        ),
        'Tregoni vetëm ato "Hapur"'
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$7.tableContainer, children: /* @__PURE__ */ jsxs("table", { className: styles$7.adminTable, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Raportuesi" }),
        /* @__PURE__ */ jsx("th", { children: "Subjekti (Mjeshtri)" }),
        /* @__PURE__ */ jsx("th", { children: "Kategoria & Statusi" }),
        /* @__PURE__ */ jsx("th", { children: "Mesazhi" }),
        /* @__PURE__ */ jsx("th", { children: "Data" }),
        /* @__PURE__ */ jsx("th", { children: "Veprimet" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: displayedReports.length > 0 ? displayedReports.map((report) => {
        var _a2, _b2, _c;
        return /* @__PURE__ */ jsxs(
          "tr",
          {
            className: report.status === "resolved" ? styles$7.resolvedRow : "",
            children: [
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: styles$7.nameCell, children: [
                /* @__PURE__ */ jsx("strong", { children: report.reporterName }),
                /* @__PURE__ */ jsx("span", { className: styles$7.subText, children: report.reporterEmail }),
                /* @__PURE__ */ jsxs("span", { className: styles$7.idBadge, children: [
                  "ID: ",
                  (_a2 = report.reporterId) == null ? void 0 : _a2.slice(-6)
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("td", { children: report.category === "Problem" ? /* @__PURE__ */ jsxs("div", { className: styles$7.nameCell, children: [
                /* @__PURE__ */ jsx("strong", { children: report.reportedUserName }),
                /* @__PURE__ */ jsxs("span", { className: styles$7.idBadge, children: [
                  "UID: ",
                  (_b2 = report.reportedUserId) == null ? void 0 : _b2.slice(-6)
                ] })
              ] }) : /* @__PURE__ */ jsx("span", { className: styles$7.naText, children: "—" }) }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: styles$7.badgeColumn, children: [
                /* @__PURE__ */ jsx("span", { className: `${styles$7.badgeBasic} ${styles$7[report.category]}`, children: report.category }),
                /* @__PURE__ */ jsx("span", { className: report.status === "open" ? styles$7.statusOpen : styles$7.statusResolved, children: report.status === "open" ? "● Hapur" : "✓ Kryer" })
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: styles$7.messageCell, children: [
                /* @__PURE__ */ jsx("div", { className: styles$7.reportTitle, children: report.title }),
                /* @__PURE__ */ jsx("div", { className: styles$7.messageScroll, children: report.message })
              ] }),
              /* @__PURE__ */ jsx("td", { children: ((_c = report.createdAt) == null ? void 0 : _c.seconds) ? new Date(report.createdAt.seconds * 1e3).toLocaleDateString("sq-AL") : "Sot" }),
              /* @__PURE__ */ jsx("td", { className: styles$7.actionCell, children: /* @__PURE__ */ jsxs("div", { className: styles$7.btnColumn, children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${report.reporterEmail}&su=${encodeURIComponent(`Re: ${report.title}`)}&body=${encodeURIComponent(
                      `Përshëndetje ${report.reporterName},

Në lidhje me mesazhin tuaj:
"${report.message}"

----------------------
Shkruani përgjigjen këtu:`
                    )}`,
                    className: styles$7.replyBtn,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: "Përgjigju ✉️"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleResolveReport(report.id, report.status),
                    className: report.status === "open" ? styles$7.resolveBtn : styles$7.reopenBtn,
                    children: report.status === "open" ? "Zgjidh" : "Rihap"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handlePermanentDelete(report.id),
                    className: styles$7.deleteBtn,
                    children: "Fshi 🗑️"
                  }
                )
              ] }) })
            ]
          },
          report.id
        );
      }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: styles$7.noResults, children: filterOpen ? "Nuk ka raporte të hapura. ✅" : "Nuk ka raporte në listë." }) }) })
    ] }) })
  ] });
}
const adminSection$1 = "_adminSection_1hswj_3";
const tableHeader$1 = "_tableHeader_1hswj_17";
const title$4 = "_title_1hswj_25";
const controlsRow$1 = "_controlsRow_1hswj_41";
const searchBox$1 = "_searchBox_1hswj_59";
const filterBtn = "_filterBtn_1hswj_131";
const filterBtnActive = "_filterBtnActive_1hswj_131";
const tableContainer$1 = "_tableContainer_1hswj_193";
const adminTable$1 = "_adminTable_1hswj_211";
const pendingRow$1 = "_pendingRow_1hswj_263";
const userCell = "_userCell_1hswj_281";
const callLink = "_callLink_1hswj_293";
const workerName$1 = "_workerName_1hswj_325";
const subText$1 = "_subText_1hswj_337";
const badgeSuccess = "_badgeSuccess_1hswj_351";
const badgeWarning$1 = "_badgeWarning_1hswj_351";
const commentCell = "_commentCell_1hswj_393";
const commentText = "_commentText_1hswj_401";
const noteInput$1 = "_noteInput_1hswj_415";
const savedNote = "_savedNote_1hswj_447";
const actionButtons$1 = "_actionButtons_1hswj_471";
const approveBtn$1 = "_approveBtn_1hswj_481";
const deleteBtn$1 = "_deleteBtn_1hswj_517";
const ratingStars = "_ratingStars_1hswj_573";
const noResults$1 = "_noResults_1hswj_583";
const whatsappBtn = "_whatsappBtn_1hswj_597";
const styles$6 = {
  adminSection: adminSection$1,
  tableHeader: tableHeader$1,
  title: title$4,
  controlsRow: controlsRow$1,
  searchBox: searchBox$1,
  filterBtn,
  filterBtnActive,
  tableContainer: tableContainer$1,
  adminTable: adminTable$1,
  pendingRow: pendingRow$1,
  userCell,
  callLink,
  workerName: workerName$1,
  subText: subText$1,
  badgeSuccess,
  badgeWarning: badgeWarning$1,
  commentCell,
  commentText,
  noteInput: noteInput$1,
  savedNote,
  actionButtons: actionButtons$1,
  approveBtn: approveBtn$1,
  deleteBtn: deleteBtn$1,
  ratingStars,
  noResults: noResults$1,
  whatsappBtn
};
function AdminReviews() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  useEffect(() => {
    fetchRecentReviews();
  }, []);
  const fetchRecentReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
      setResults(reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      fetchRecentReviews();
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "reviews"),
        where("searchName", ">=", term),
        where("searchName", "<=", term + "")
      );
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
      setResults(reviews);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleApproveReview = async (reviewId) => {
    const adminNote = notes[reviewId] || "";
    if (!window.confirm("Konfirmon që e ke verifikuar këtë rishikim?")) return;
    setActionLoading(reviewId);
    const functions2 = getFunctions();
    const approve = httpsCallable(functions2, "approveReview");
    try {
      await approve({ reviewId, note: adminNote });
      setResults((prev) => prev.map(
        (r) => r.id === reviewId ? { ...r, status: "approved", isVerified: true, adminNote } : r
      ));
      alert("Rishikimi u miratua!");
    } catch (err) {
      console.error("Approve error:", err);
      alert("Gabim: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("A jeni i sigurt që dëshironi të fshini këtë koment?")) return;
    setActionLoading(reviewId);
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setResults((prev) => prev.filter((r) => r.id !== reviewId));
      alert("Komenti u fshi.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Dështoi fshirja.");
    } finally {
      setActionLoading(null);
    }
  };
  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };
  const displayedReviews = filterStatus === "pending" ? results.filter((r) => r.status !== "approved") : results;
  return /* @__PURE__ */ jsxs("div", { className: styles$6.adminSection, children: [
    /* @__PURE__ */ jsxs("div", { className: styles$6.tableHeader, children: [
      /* @__PURE__ */ jsx("h2", { className: styles$6.title, children: "Moderimi i Komenteve" }),
      /* @__PURE__ */ jsxs("div", { className: styles$6.controlsRow, children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: styles$6.searchBox, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Kërko mjeshtrin...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "submit", children: "Kërko" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: filterStatus === "pending" ? styles$6.filterBtnActive : styles$6.filterBtn,
            onClick: () => setFilterStatus((prev) => prev === "all" ? "pending" : "all"),
            children: filterStatus === "all" ? "Shiko Vetëm Në Pritje" : "Shiko Të Gjitha"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$6.tableContainer, children: /* @__PURE__ */ jsxs("table", { className: styles$6.adminTable, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Klienti & Telefoni" }),
        /* @__PURE__ */ jsx("th", { children: "Mjeshtri" }),
        /* @__PURE__ */ jsx("th", { children: "Statusi" }),
        /* @__PURE__ */ jsx("th", { children: "Vlerësimi & Komenti" }),
        /* @__PURE__ */ jsx("th", { children: "Data" }),
        /* @__PURE__ */ jsx("th", { children: "Veprimet" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: displayedReviews.length > 0 ? displayedReviews.map((review) => {
        var _a2, _b2, _c, _d;
        return /* @__PURE__ */ jsxs("tr", { className: review.status === "approved" ? "" : styles$6.pendingRow, children: [
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: styles$6.userCell, children: [
            /* @__PURE__ */ jsx("strong", { children: review.customerName }),
            /* @__PURE__ */ jsxs("a", { href: `tel:${(_a2 = review.customerPhone) == null ? void 0 : _a2.replace(/\s/g, "")}`, className: styles$6.callLink, children: [
              "📞 ",
              review.customerPhone
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("td", { children: [
            /* @__PURE__ */ jsx("span", { className: styles$6.workerName, children: review.workerName }),
            /* @__PURE__ */ jsxs("div", { className: styles$6.subText, children: [
              "ID: ",
              (_b2 = review.workerId) == null ? void 0 : _b2.substring(0, 8)
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: review.status === "approved" ? styles$6.badgeSuccess : styles$6.badgeWarning, children: review.status === "approved" ? "I Miratuar ✅" : "Në Pritje ⏳" }) }),
          /* @__PURE__ */ jsxs("td", { className: styles$6.commentCell, children: [
            /* @__PURE__ */ jsx("div", { className: styles$6.ratingStars, children: "⭐".repeat(review.rating) }),
            /* @__PURE__ */ jsx("p", { className: styles$6.commentText, children: review.comment || "Pa koment" }),
            review.status !== "approved" ? /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: styles$6.noteInput,
                placeholder: "Shto shënim...",
                value: notes[review.id] || "",
                onChange: (e) => handleNoteChange(review.id, e.target.value)
              }
            ) : review.adminNote && /* @__PURE__ */ jsxs("div", { className: styles$6.savedNote, children: [
              "📝 ",
              review.adminNote
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { children: ((_c = review.createdAt) == null ? void 0 : _c.seconds) ? new Date(review.createdAt.seconds * 1e3).toLocaleDateString("sq-AL") : "Sot" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: styles$6.actionButtons, children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/${(_d = review.customerPhone) == null ? void 0 : _d.replace(/\D/g, "")}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: styles$6.whatsappBtn,
                children: "💬 WhatsApp"
              }
            ),
            review.status !== "approved" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleApproveReview(review.id),
                className: styles$6.approveBtn,
                disabled: actionLoading === review.id,
                children: actionLoading === review.id ? "..." : "Mirato"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDeleteReview(review.id),
                className: styles$6.deleteBtn,
                disabled: actionLoading === review.id,
                children: "Fshi"
              }
            )
          ] }) })
        ] }, review.id);
      }) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: "6", className: styles$6.noResults, children: loading ? "Duke u ngarkuar..." : "Nuk u gjet asnjë rishikim." }) }) })
    ] }) })
  ] });
}
const StorageImage = memo(function StorageImage2({ path, className }) {
  const [url, setUrl] = useState(null);
  const [error2, setError] = useState(false);
  useEffect(() => {
    let isMounted = true;
    if (!path) return;
    const fetchUrl = async () => {
      try {
        const imageRef = ref(storage, path);
        const downloadUrl = await getDownloadURL(imageRef);
        if (isMounted) setUrl(downloadUrl);
      } catch (err) {
        if (isMounted) setError(true);
      }
    };
    fetchUrl();
    return () => {
      isMounted = false;
    };
  }, [path]);
  if (error2) return /* @__PURE__ */ jsx("div", { className, style: { background: "#fee2e2" }, children: "⚠️" });
  if (!url) return /* @__PURE__ */ jsx("div", { className, style: { background: "#f1f5f9" } });
  return /* @__PURE__ */ jsx("a", { href: url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: url, alt: "ID Preview", className }) });
});
const adminSection = "_adminSection_1l9q8_5";
const tableHeader = "_tableHeader_1l9q8_19";
const title$3 = "_title_1l9q8_27";
const controlsRow = "_controlsRow_1l9q8_43";
const searchBox = "_searchBox_1l9q8_59";
const tableContainer = "_tableContainer_1l9q8_109";
const adminTable = "_adminTable_1l9q8_125";
const pendingRow = "_pendingRow_1l9q8_169";
const workerName = "_workerName_1l9q8_177";
const subText = "_subText_1l9q8_189";
const idThumbnail = "_idThumbnail_1l9q8_199";
const badgeWarning = "_badgeWarning_1l9q8_227";
const actionButtons = "_actionButtons_1l9q8_247";
const approveBtn = "_approveBtn_1l9q8_257";
const deleteBtn = "_deleteBtn_1l9q8_277";
const noResults = "_noResults_1l9q8_297";
const styles$5 = {
  adminSection,
  tableHeader,
  title: title$3,
  controlsRow,
  searchBox,
  tableContainer,
  adminTable,
  pendingRow,
  workerName,
  subText,
  idThumbnail,
  badgeWarning,
  actionButtons,
  approveBtn,
  deleteBtn,
  noResults
};
function AdminVerifications({ setGlobalCount }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (setGlobalCount) {
      setGlobalCount(results.length);
    }
  }, [results, setGlobalCount]);
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "verificationRequests"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      fetchRequests();
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "verificationRequests"),
        where("status", "==", "pending"),
        where("searchName", ">=", term),
        where("searchName", "<=", term + ""),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleAction = async (id, type, currCount) => {
    const confirmAction = window.confirm(`A jeni i sigurt që dëshironi të ${type === "APPROVE" ? "pranoni" : "refuzoni"} këtë kërkesë?`);
    if (!confirmAction) return;
    const workerRef = doc(db, "workers", id);
    const requestRef = doc(db, "verificationRequests", id);
    try {
      if (type === "APPROVE") {
        await Promise.all([
          updateDoc(workerRef, { isVerified: true, verificationRejected: false }),
          updateDoc(requestRef, { status: "approved", updatedAt: serverTimestamp() })
        ]);
        alert("Mjeshtri u verifikua!");
      } else if (type === "REJECT") {
        await Promise.all([
          updateDoc(workerRef, { isVerified: false, verificationRejected: true, rejectedAt: serverTimestamp() }),
          updateDoc(requestRef, {
            status: "rejected",
            rejectionCount: increment(1),
            updatedAt: serverTimestamp()
          })
        ]);
        alert("Kërkesa u refuzua.");
      }
      setResults((prev) => prev.filter((req) => req.id !== id));
    } catch (error2) {
      console.error("Error:", error2);
      alert("Gabim: " + error2.message);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: styles$5.adminSection, children: [
    /* @__PURE__ */ jsxs("header", { className: styles$5.tableHeader, children: [
      /* @__PURE__ */ jsx("h1", { className: styles$5.title, children: "Kërkesat për Verifikim" }),
      /* @__PURE__ */ jsxs("div", { className: styles$5.controlsRow, children: [
        /* @__PURE__ */ jsxs("p", { className: styles$5.subText, children: [
          "Kërkesa në pritje: ",
          /* @__PURE__ */ jsx("strong", { children: results.length })
        ] }),
        /* @__PURE__ */ jsxs("form", { className: styles$5.searchBox, onSubmit: handleSearch, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "Kërko mjeshtrin...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "submit", children: "Kërko" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles$5.tableContainer, children: loading ? /* @__PURE__ */ jsx("div", { className: styles$5.noResults, children: "Duke u ngarkuar..." }) : results.length > 0 ? /* @__PURE__ */ jsxs("table", { className: styles$5.adminTable, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "Punëtori" }),
        /* @__PURE__ */ jsx("th", { children: "Dokumenti (ID)" }),
        /* @__PURE__ */ jsx("th", { children: "Data" }),
        /* @__PURE__ */ jsx("th", { children: "Statusi" }),
        /* @__PURE__ */ jsx("th", { children: "Veprimet" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: results.map((req) => {
        var _a2;
        return /* @__PURE__ */ jsxs("tr", { className: styles$5.pendingRow, children: [
          /* @__PURE__ */ jsxs("td", { className: styles$5.userCell, children: [
            /* @__PURE__ */ jsx("span", { className: styles$5.workerName, children: req.workerName }),
            /* @__PURE__ */ jsxs("span", { className: styles$5.subText, children: [
              "ID: ",
              req.uid
            ] }),
            req.rejectionCount > 0 && /* @__PURE__ */ jsxs("div", { className: styles$5.badgeWarning, style: { marginTop: "8px" }, children: [
              "⚠️ Refuzuar ",
              req.rejectionCount,
              "x më parë"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(StorageImage, { path: req.storagePath, className: styles$5.idThumbnail }) }),
          /* @__PURE__ */ jsx("td", { className: styles$5.subText, children: ((_a2 = req.createdAt) == null ? void 0 : _a2.toDate) ? req.createdAt.toDate().toLocaleDateString() : "Sot" }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: styles$5.badgeWarning, children: "Në Shqyrtim" }) }),
          /* @__PURE__ */ jsxs("td", { className: styles$5.actionButtons, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: styles$5.approveBtn,
                onClick: () => handleAction(req.id, "APPROVE"),
                children: "Prano"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: styles$5.deleteBtn,
                onClick: () => handleAction(req.id, "REJECT", req.rejectionCount),
                children: "Refuzo"
              }
            )
          ] })
        ] }, req.id);
      }) })
    ] }) : /* @__PURE__ */ jsx("div", { className: styles$5.noResults, children: "Nuk ka kërkesa të reja." }) })
  ] });
}
const adminDashboardContainer = "_adminDashboardContainer_q3idq_1";
const tabNavigation = "_tabNavigation_q3idq_19";
const activeTab = "_activeTab_q3idq_71";
const tabContent = "_tabContent_q3idq_85";
const pinOverlay = "_pinOverlay_q3idq_247";
const pinBox = "_pinBox_q3idq_273";
const lockIcon = "_lockIcon_q3idq_309";
const pinInput = "_pinInput_q3idq_355";
const verifyBtn = "_verifyBtn_q3idq_403";
const logoutBtn = "_logoutBtn_q3idq_501";
const spinner$2 = "_spinner_q3idq_703";
const notesOverlay = "_notesOverlay_q3idq_909";
const notesDrawer = "_notesDrawer_q3idq_935";
const drawerHeader = "_drawerHeader_q3idq_963";
const closeDrawerBtn = "_closeDrawerBtn_q3idq_993";
const noteInputGroup = "_noteInputGroup_q3idq_1027";
const noteInput = "_noteInput_q3idq_1027";
const noteSaveBtn = "_noteSaveBtn_q3idq_1071";
const notesList = "_notesList_q3idq_1093";
const noteItem = "_noteItem_q3idq_1117";
const noteContent = "_noteContent_q3idq_1139";
const noteText = "_noteText_q3idq_1153";
const noteTime = "_noteTime_q3idq_1167";
const deleteNoteBtn = "_deleteNoteBtn_q3idq_1179";
const noNotes = "_noNotes_q3idq_1205";
const styles$4 = {
  adminDashboardContainer,
  tabNavigation,
  activeTab,
  tabContent,
  pinOverlay,
  pinBox,
  lockIcon,
  pinInput,
  verifyBtn,
  logoutBtn,
  spinner: spinner$2,
  notesOverlay,
  notesDrawer,
  drawerHeader,
  closeDrawerBtn,
  noteInputGroup,
  noteInput,
  noteSaveBtn,
  notesList,
  noteItem,
  noteContent,
  noteText,
  noteTime,
  deleteNoteBtn,
  noNotes
};
const ADMIN_UID = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";
const ADMIN_PIN_HASH = "8c2cd4a7bcff84654004d26d74ae332c7e24d701db2e5433ef672c2daf4b499c";
const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];
const COLLECTIONS = [
  { id: "workers", label: "Mjeshtrit", icon: "🛠️" },
  { id: "contactSessions", label: "Kontaktet", icon: "📞" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "reviewRequest", label: "Kërkesat për review", icon: "✉️" },
  { id: "reports", label: "Raportet", icon: "🚩" },
  { id: "verificationRequests", label: "Verifikimet", icon: "🪪" }
];
const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "workers", label: "Mjeshtrit", icon: "🛠️" },
  { id: "contacts", label: "Kontaktet", icon: "📞" },
  { id: "reviewRequests", label: "Review Requests", icon: "✉️" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "reports", label: "Raportet", icon: "🚩" },
  { id: "verifications", label: "Verifikimet", icon: "🪪" },
  { id: "categorySugg", label: "Category Suggestions", icon: "📊" },
  { id: "explorer", label: "Data Explorer", icon: "🗃️" }
];
const panelStyle = {
  background: "var(--admin-card, #ffffff)",
  border: "1px solid var(--admin-border, #e5e7eb)",
  borderRadius: 14,
  padding: 18,
  minWidth: 0
};
const mutedStyle = {
  color: "var(--admin-muted, #64748b)",
  fontSize: 13
};
const buttonStyle = {
  border: "1px solid var(--admin-border, #e2e8f0)",
  background: "var(--admin-card, #fff)",
  color: "var(--admin-text, #0f172a)",
  borderRadius: 9,
  padding: "9px 12px",
  cursor: "pointer",
  fontSize: 13
};
function timestampMs(value) {
  if (!value) return 0;
  if (typeof (value == null ? void 0 : value.toMillis) === "function") return value.toMillis();
  if (typeof (value == null ? void 0 : value.seconds) === "number") return value.seconds * 1e3;
  if (typeof value === "number") return value;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}
function dateLabel(value) {
  const ms = timestampMs(value);
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function dateTimeLabel(value) {
  const ms = timestampMs(value);
  if (!ms) return "—";
  return new Date(ms).toLocaleString("sq-AL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}
function countBy(items, getter) {
  const result = {};
  items.forEach((item) => {
    const key = getter(item) || "Pa të dhëna";
    result[key] = (result[key] || 0) + 1;
  });
  return Object.entries(result).map(([name2, value]) => ({ name: name2, value })).sort((a, b) => b.value - a.value);
}
function isWithinDays(item, days) {
  const ms = timestampMs(item.createdAt);
  const now = Date.now();
  return ms > 0 && ms >= now - days * 864e5 && ms <= now;
}
function percentage(numerator, denominator) {
  if (!denominator) return "0.0";
  return (numerator / denominator * 100).toFixed(1);
}
function isOpenStatus(value) {
  const status2 = normalize(value);
  return [
    "pending",
    "open",
    "new",
    "in_review",
    "in review",
    "waiting",
    "submitted"
  ].includes(status2);
}
function StatCard({ icon: icon2, label: label2, value, hint, onClick, tone = "#2563eb" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onClick,
      onKeyDown: (e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      },
      style: {
        ...panelStyle,
        cursor: onClick ? "pointer" : "default",
        transition: "transform .15s ease, box-shadow .15s ease"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: { display: "flex", justifyContent: "space-between", gap: 12 },
          children: [
            /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
              /* @__PURE__ */ jsx("div", { style: mutedStyle, children: label2 }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    fontSize: 29,
                    lineHeight: 1.25,
                    fontWeight: 800,
                    marginTop: 8,
                    overflowWrap: "anywhere"
                  },
                  children: value
                }
              ),
              hint && /* @__PURE__ */ jsx("div", { style: { ...mutedStyle, marginTop: 7 }, children: hint })
            ] }),
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  width: 43,
                  height: 43,
                  flexShrink: 0,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: `${tone}15`,
                  fontSize: 21
                },
                children: icon2
              }
            )
          ]
        }
      )
    }
  );
}
function SectionTitle({ title: title3, description: description2, action }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 16
      },
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: 21 }, children: title3 }),
          description2 && /* @__PURE__ */ jsx("p", { style: { ...mutedStyle, margin: "6px 0 0", lineHeight: 1.6 }, children: description2 })
        ] }),
        action
      ]
    }
  );
}
function Badge({ children, color = "#64748b" }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 99,
        background: `${color}15`,
        color,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap"
      },
      children: children || "Pa status"
    }
  );
}
function SimpleTable({ columns, rows, emptyMessage = "Nuk ka të dhëna." }) {
  return /* @__PURE__ */ jsx("div", { style: { overflowX: "auto", width: "100%" }, children: /* @__PURE__ */ jsxs(
    "table",
    {
      style: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        fontSize: 13
      },
      children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((column) => /* @__PURE__ */ jsx(
          "th",
          {
            style: {
              padding: "11px 10px",
              borderBottom: "1px solid var(--admin-border, #e5e7eb)",
              color: "var(--admin-muted, #64748b)",
              fontWeight: 700,
              whiteSpace: "nowrap"
            },
            children: column.label
          },
          column.key
        )) }) }),
        /* @__PURE__ */ jsx("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
          "td",
          {
            colSpan: columns.length,
            style: { padding: 22, textAlign: "center", color: "#64748b" },
            children: emptyMessage
          }
        ) }) : rows.map((row2, index) => /* @__PURE__ */ jsx("tr", { children: columns.map((column) => /* @__PURE__ */ jsx(
          "td",
          {
            style: {
              padding: "12px 10px",
              borderBottom: "1px solid var(--admin-border, #f1f5f9)",
              verticalAlign: "top",
              maxWidth: 280,
              overflowWrap: "anywhere"
            },
            children: column.render ? column.render(row2) : String(row2[column.key] ?? "—")
          },
          column.key
        )) }, row2.id || index)) })
      ]
    }
  ) });
}
async function hashPin(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function AdminDashboard() {
  var _a2, _b2;
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const noteRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinVerified, setPinVerified] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );
  const [pinInput2, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab2, setActiveTab] = useState("overview");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState([]);
  const [processingSuggestion, setProcessingSuggestion] = useState(null);
  const [globalStats, setGlobalStats] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period2, setPeriod] = useState("30");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("contactSessions");
  const [refreshError, setRefreshError] = useState("");
  const [records, setRecords] = useState({
    workers: [],
    contactSessions: [],
    reviews: [],
    reviewRequest: [],
    reports: [],
    verificationRequests: []
  });
  const [loaded, setLoaded] = useState({});
  const [loadErrors, setLoadErrors] = useState({});
  useEffect(() => {
    var _a3;
    if (!pinVerified) (_a3 = inputRef.current) == null ? void 0 : _a3.focus();
    try {
      const saved = JSON.parse(localStorage.getItem("Adminnotes") || "[]");
      setAdminNotes(Array.isArray(saved) ? saved : []);
    } catch {
      setAdminNotes([]);
    }
  }, [pinVerified]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        setUser(null);
        setLoading(false);
        navigate("/");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);
  useEffect(() => {
    if (!user) return void 0;
    const unsubscribers = [];
    unsubscribers.push(
      onSnapshot(
        doc(db, "metadata", "globalStats"),
        (snapshot) => {
          setGlobalStats(snapshot.exists() ? snapshot.data() : {});
        },
        (error2) => setRefreshError(`Global stats: ${error2.message}`)
      )
    );
    COLLECTIONS.forEach(({ id }) => {
      unsubscribers.push(
        onSnapshot(
          collection(db, id),
          (snapshot) => {
            const items = snapshot.docs.map((item) => ({
              id: item.id,
              ...item.data()
            }));
            setRecords((previous) => ({ ...previous, [id]: items }));
            setLoaded((previous) => ({ ...previous, [id]: true }));
            setLoadErrors((previous) => ({ ...previous, [id]: "" }));
          },
          (error2) => {
            setLoadErrors((previous) => ({
              ...previous,
              [id]: error2.message
            }));
          }
        )
      );
    });
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [user]);
  const loadCategorySuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      setSuggestionError("");
      const suggestionsRef = collection(db, "categorySuggestions");
      const snapshot = await getDocs(suggestionsRef);
      const suggestions = snapshot.docs.map((document2) => ({
        id: document2.id,
        ...document2.data()
      }));
      suggestions.sort((a, b) => {
        var _a3, _b3, _c, _d, _e, _f;
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        const dateA = ((_c = (_b3 = (_a3 = a.createdAt) == null ? void 0 : _a3.toDate) == null ? void 0 : _b3.call(_a3)) == null ? void 0 : _c.getTime()) || 0;
        const dateB = ((_f = (_e = (_d = b.createdAt) == null ? void 0 : _d.toDate) == null ? void 0 : _e.call(_d)) == null ? void 0 : _f.getTime()) || 0;
        return dateB - dateA;
      });
      setCategorySuggestions(suggestions);
    } catch (error2) {
      console.error("Error loading category suggestions:", error2);
      setSuggestionError("Gabim gjatë ngarkimit të sugjerimeve.");
    } finally {
      setLoadingSuggestions(false);
    }
  };
  const approveCategorySuggestion = async (suggestion) => {
    var _a3;
    const suggestedCategory = (_a3 = suggestion.suggestedCategory) == null ? void 0 : _a3.trim();
    const workerId = suggestion.workerId || suggestion.id;
    if (!suggestedCategory || !workerId) {
      alert("Mungojnë të dhënat e kategorisë ose punëtorit.");
      return;
    }
    if (suggestion.status !== "pending") {
      alert("Ky sugjerim është shqyrtuar më parë.");
      return;
    }
    const confirmed = window.confirm(
      `A dëshiron ta aprovosh kategorinë "${suggestedCategory}"?`
    );
    if (!confirmed) return;
    try {
      setProcessingSuggestion(suggestion.id);
      const workerRef = doc(db, "workers", workerId);
      const suggestionRef = doc(db, "categorySuggestions", suggestion.id);
      const workerSnapshot = await getDoc(workerRef);
      if (!workerSnapshot.exists()) {
        throw new Error("Punëtori nuk u gjet në databazë.");
      }
      const batch = writeBatch(db);
      batch.update(workerRef, {
        category: suggestedCategory,
        customCategory: suggestedCategory,
        categoryStatus: "approved"
      });
      batch.update(suggestionRef, {
        status: "approved",
        reviewedAt: serverTimestamp(),
        reviewedBy: auth.currentUser.uid
      });
      await batch.commit();
      setCategorySuggestions(
        (previous) => previous.map(
          (item) => item.id === suggestion.id ? { ...item, status: "approved" } : item
        )
      );
      alert(`Kategoria "${suggestedCategory}" u aprovua me sukses!`);
    } catch (error2) {
      console.error("Error approving category:", error2);
      alert(error2.message || "Gabim gjatë aprovimit të kategorisë.");
    } finally {
      setProcessingSuggestion(null);
    }
  };
  const declineCategorySuggestion = async (suggestion) => {
    if (suggestion.status !== "pending") {
      alert("Ky sugjerim është shqyrtuar më parë.");
      return;
    }
    const confirmed = window.confirm(
      `A dëshiron ta refuzosh kategorinë "${suggestion.suggestedCategory}"?`
    );
    if (!confirmed) return;
    try {
      setProcessingSuggestion(suggestion.id);
      const suggestionRef = doc(db, "categorySuggestions", suggestion.id);
      await updateDoc(suggestionRef, {
        status: "declined",
        reviewedAt: serverTimestamp(),
        reviewedBy: auth.currentUser.uid
      });
      setCategorySuggestions(
        (previous) => previous.map(
          (item) => item.id === suggestion.id ? { ...item, status: "declined" } : item
        )
      );
      alert("Sugjerimi u refuzua.");
    } catch (error2) {
      console.error("Error declining category:", error2);
      alert("Gabim gjatë refuzimit të kategorisë.");
    } finally {
      setProcessingSuggestion(null);
    }
  };
  useEffect(() => {
    loadCategorySuggestions();
  }, []);
  const workers = records.workers;
  const contacts = records.contactSessions;
  const reviews = records.reviews;
  const reviewRequests = records.reviewRequest;
  const reports = records.reports;
  const verifications = records.verificationRequests;
  const workerById = useMemo(
    () => new Map(workers.map((worker) => [worker.id, worker])),
    [workers]
  );
  const contactById = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact])),
    [contacts]
  );
  const analytics = useMemo(() => {
    const activeWorkers = workers.filter((worker) => worker.isActive === true);
    const verifiedWorkers = workers.filter(
      (worker) => worker.isVerified === true
    );
    const proWorkers = workers.filter((worker) => worker.isPro === true);
    const availableWorkers = workers.filter(
      (worker) => worker.isAvailable === true
    );
    const featuredWorkers2 = workers.filter(
      (worker) => worker.isFeatured === true
    );
    const pendingVerifications = verifications.filter(
      (item) => isOpenStatus(item.status)
    );
    const openReports = reports.filter((item) => isOpenStatus(item.status));
    const pendingReviewRequests = reviewRequests.filter(
      (item) => isOpenStatus(item.status)
    );
    const pendingReviews = reviews.filter((item) => isOpenStatus(item.status));
    const verifiedReviews = reviews.filter((item) => item.isVerified === true);
    const suspiciousReviews = reviews.filter(
      (item) => item.isDifferentDevice === true
    );
    const ratings = reviews.map((review) => Number(review.rating)).filter(
      (rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5
    );
    const averageRating = ratings.length ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    const recentContacts = contacts.filter(
      (item) => isWithinDays(item, Number(period2))
    );
    const recentReviews = reviews.filter(
      (item) => isWithinDays(item, Number(period2))
    );
    const recentReports = reports.filter(
      (item) => isWithinDays(item, Number(period2))
    );
    const recentWorkers = workers.filter(
      (item) => isWithinDays(item, Number(period2))
    );
    const contactsWithReview = contacts.filter(
      (contact) => reviews.some(
        (review) => review.workerId && contact.workerId && review.workerId === contact.workerId && (review.customerPhone && contact.customerPhone && normalize(review.customerPhone) === normalize(contact.customerPhone) || review.reviewerFingerprint && contact.fingerPrint && review.reviewerFingerprint === contact.fingerPrint)
      )
    );
    const contactsByWorker = countBy(contacts, (item) => {
      const worker = workerById.get(item.workerId);
      return (worker == null ? void 0 : worker.fullName) || item.workerId || "Mjeshtër i panjohur";
    }).slice(0, 10);
    const workerPerformance = workers.map((worker) => {
      const workerContacts = contacts.filter(
        (item) => item.workerId === worker.id
      );
      const workerReviews = reviews.filter(
        (item) => item.workerId === worker.id
      );
      const workerReports = reports.filter(
        (item) => item.reportedUserId === worker.id
      );
      const workerRequests = reviewRequests.filter(
        (item) => item.workerId === worker.id
      );
      const numericRatings = workerReviews.map((item) => Number(item.rating)).filter(
        (rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5
      );
      return {
        id: worker.id,
        name: worker.fullName || worker.searchName || worker.id,
        city: worker.city || "Pa qytet",
        category: worker.category || "Pa kategori",
        isPro: worker.isPro === true,
        isVerified: worker.isVerified === true,
        contacts: workerContacts.length,
        reviews: workerReviews.length,
        reports: workerReports.length,
        reviewRequests: workerRequests.length,
        rating: numericRatings.length ? numericRatings.reduce((sum, rating) => sum + rating, 0) / numericRatings.length : Number(worker.avgRating) || 0,
        active: worker.isActive === true
      };
    });
    const timeline = Array.from(
      { length: Number(period2) === 7 ? 7 : 30 },
      (_, index) => {
        const days = Number(period2) === 7 ? 7 : 30;
        const date2 = /* @__PURE__ */ new Date();
        date2.setHours(0, 0, 0, 0);
        date2.setDate(date2.getDate() - (days - index - 1));
        const nextDate = new Date(date2);
        nextDate.setDate(nextDate.getDate() + 1);
        const inDay = (item) => {
          const ms = timestampMs(item.createdAt);
          return ms >= date2.getTime() && ms < nextDate.getTime();
        };
        return {
          date: date2.toLocaleDateString("sq-AL", {
            day: "2-digit",
            month: "short"
          }),
          Kontakte: contacts.filter(inDay).length,
          Reviews: reviews.filter(inDay).length,
          Raporte: reports.filter(inDay).length,
          Regjistrime: workers.filter(inDay).length
        };
      }
    );
    return {
      activeWorkers,
      verifiedWorkers,
      proWorkers,
      availableWorkers,
      featuredWorkers: featuredWorkers2,
      pendingVerifications,
      openReports,
      pendingReviewRequests,
      pendingReviews,
      verifiedReviews,
      suspiciousReviews,
      averageRating,
      recentContacts,
      recentReviews,
      recentReports,
      recentWorkers,
      contactsWithReview,
      contactsByWorker,
      workerPerformance,
      timeline,
      cityBreakdown: countBy(workers, (item) => item.city || "Pa qytet"),
      categoryBreakdown: countBy(
        workers,
        (item) => item.category || "Pa kategori"
      ),
      reportCategories: countBy(
        reports,
        (item) => item.category || "Pa kategori"
      ),
      reportStatuses: countBy(reports, (item) => item.status || "Pa status"),
      reviewStatuses: countBy(reviews, (item) => item.status || "Pa status"),
      verificationStatuses: countBy(
        verifications,
        (item) => item.status || "Pa status"
      ),
      ratingsBreakdown: [5, 4, 3, 2, 1].map((rating) => ({
        name: `${rating} ⭐`,
        value: ratings.filter((value) => value === rating).length
      })),
      topWorkers: [...workerPerformance].sort((a, b) => b.contacts - a.contacts).slice(0, 10),
      highestRated: [...workerPerformance].filter((worker) => worker.reviews > 0).sort((a, b) => b.rating - a.rating).slice(0, 10),
      mostReported: [...workerPerformance].filter((worker) => worker.reports > 0).sort((a, b) => b.reports - a.reports).slice(0, 10),
      contactRate: percentage(contactsWithReview.length, contacts.length),
      reviewVerificationRate: percentage(
        verifiedReviews.length,
        reviews.length
      ),
      activeRate: percentage(activeWorkers.length, workers.length),
      proRate: percentage(proWorkers.length, workers.length),
      verifiedRate: percentage(verifiedWorkers.length, workers.length),
      totalRatings: ratings.length
    };
  }, [
    workers,
    contacts,
    reviews,
    reviewRequests,
    reports,
    verifications,
    workerById,
    period2
  ]);
  useEffect(() => {
    setLoaded((previous) => previous);
  }, []);
  const handlePinSubmit = async (event) => {
    event.preventDefault();
    setPinError("");
    try {
      const inputHash = await hashPin(pinInput2);
      if (inputHash === ADMIN_PIN_HASH) {
        sessionStorage.setItem("admin_auth", "true");
        setPinVerified(true);
        setPinInput("");
      } else {
        setPinError("PIN-i është i gabuar.");
        setPinInput("");
      }
    } catch {
      setPinError("Nuk u verifikua PIN-i. Provo përsëri.");
    }
  };
  const logoutSession = () => {
    sessionStorage.removeItem("admin_auth");
    setPinVerified(false);
    setPinInput("");
    setActiveTab("overview");
  };
  const addNote = () => {
    var _a3, _b3;
    const value = (_b3 = (_a3 = noteRef.current) == null ? void 0 : _a3.value) == null ? void 0 : _b3.trim();
    if (!value) return;
    const note = {
      text: value,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString("sq-AL", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      })
    };
    const updated = [note, ...adminNotes];
    setAdminNotes(updated);
    localStorage.setItem("Adminnotes", JSON.stringify(updated));
    if (noteRef.current) noteRef.current.value = "";
  };
  const deleteNote = (index) => {
    const updated = adminNotes.filter((_, i) => i !== index);
    setAdminNotes(updated);
    localStorage.setItem("Adminnotes", JSON.stringify(updated));
  };
  const exportCsv = useCallback((items, filename) => {
    if (!items.length) {
      window.alert("Nuk ka të dhëna për eksport.");
      return;
    }
    const keys = [...new Set(items.flatMap((item) => Object.keys(item)))];
    const valueToText = (value) => {
      if (value == null) return "";
      if (typeof (value == null ? void 0 : value.toDate) === "function")
        return value.toDate().toISOString();
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };
    const escapeCsv = (value) => `"${valueToText(value).replace(/"/g, '""')}"`;
    const csv = [
      keys.map(escapeCsv).join(","),
      ...items.map((item) => keys.map((key) => escapeCsv(item[key])).join(","))
    ].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);
  const goTo = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("all");
  };
  const explorerRows = useMemo(() => {
    const items = records[selectedCollection] || [];
    const term = normalize(search);
    return items.filter((item) => {
      const matchesSearch = !term || Object.entries(item).some(([key, value]) => {
        if (key === "storagePath") return false;
        if (value && typeof value === "object") {
          return normalize(dateLabel(value)).includes(term);
        }
        return normalize(value).includes(term);
      });
      const matchesStatus = statusFilter === "all" || normalize(item.status) === normalize(statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [records, selectedCollection, search, statusFilter]);
  const allStatuses = useMemo(
    () => [
      ...new Set(
        (records[selectedCollection] || []).map((item) => item.status).filter(Boolean)
      )
    ],
    [records, selectedCollection]
  );
  const recentActivity = useMemo(() => {
    const combined = [
      ...contacts.map((item) => ({
        ...item,
        activityType: "Kontakt",
        activityName: item.customerName || "Klient"
      })),
      ...reviews.map((item) => ({
        ...item,
        activityType: "Review",
        activityName: item.customerName || "Klient"
      })),
      ...reports.map((item) => ({
        ...item,
        activityType: "Raport",
        activityName: item.title || item.reporterName || "Raport"
      })),
      ...workers.map((item) => ({
        ...item,
        activityType: "Mjeshtër",
        activityName: item.fullName || "Mjeshtër i ri"
      })),
      ...verifications.map((item) => ({
        ...item,
        activityType: "Verifikim",
        activityName: item.workerName || item.searchName || "Verifikim"
      }))
    ];
    return combined.sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt)).slice(0, 12);
  }, [contacts, reviews, reports, workers, verifications]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: styles$4.spinner, children: "Duke verifikuar autoritetin..." });
  }
  if (!user) return null;
  if (!pinVerified) {
    return /* @__PURE__ */ jsx("div", { className: styles$4.pinOverlay, children: /* @__PURE__ */ jsxs("form", { className: styles$4.pinBox, onSubmit: handlePinSubmit, children: [
      /* @__PURE__ */ jsx("div", { className: styles$4.lockIcon, children: "🔐" }),
      /* @__PURE__ */ jsx("h3", { children: "Hyrja e Sigurt" }),
      /* @__PURE__ */ jsx("p", { children: "Shënoni PIN-in për të hapur panelin e kontrollit." }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "password",
          autoComplete: "current-password",
          placeholder: "Shkruaj PIN-in",
          value: pinInput2,
          onChange: (event) => setPinInput(event.target.value),
          className: styles$4.pinInput,
          required: true
        }
      ),
      pinError && /* @__PURE__ */ jsx("p", { role: "alert", style: { color: "#dc2626", fontSize: 13 }, children: pinError }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: styles$4.verifyBtn, children: "Hyr në panel" })
    ] }) });
  }
  const collectionName = ((_a2 = COLLECTIONS.find((item) => item.id === selectedCollection)) == null ? void 0 : _a2.label) || selectedCollection;
  ((_b2 = NAV.find((item) => item.id === activeTab2)) == null ? void 0 : _b2.label) || "Admin";
  return /* @__PURE__ */ jsxs("div", { className: styles$4.adminDashboardContainer, children: [
    /* @__PURE__ */ jsxs("header", { className: styles$4.dashboardHeader, children: [
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 22
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: styles$4.titleGroup, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h1", { children: "Gjejnjerin Control Center" }),
                /* @__PURE__ */ jsx("p", { style: mutedStyle, children: "Marketplace intelligence · Operacione · Trust & Safety" })
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: logoutSession, className: styles$4.logoutBtn, children: "Mbyll sesionin 🔒" })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  style: buttonStyle,
                  onClick: () => setIsNotesOpen(true),
                  children: [
                    "📌 Shënimet (",
                    adminNotes.length,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  style: buttonStyle,
                  onClick: () => exportCsv(recentActivity, "gjejnjerin-activity.csv"),
                  children: "⬇ Eksporto aktivitetin"
                }
              )
            ] })
          ]
        }
      ),
      refreshError && /* @__PURE__ */ jsx(
        "div",
        {
          role: "alert",
          style: {
            ...panelStyle,
            borderColor: "#fca5a5",
            color: "#b91c1c",
            marginBottom: 16
          },
          children: refreshError
        }
      ),
      Object.entries(loadErrors).some(([, error2]) => error2) && /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            ...panelStyle,
            borderColor: "#fbbf24",
            marginBottom: 16
          },
          children: [
            /* @__PURE__ */ jsx("strong", { children: "Vëmendje: disa koleksione nuk u ngarkuan." }),
            /* @__PURE__ */ jsx("p", { style: mutedStyle, children: "Kontrollo Firestore Security Rules dhe lejet e llogarisë admin." }),
            Object.entries(loadErrors).filter(([, error2]) => error2).map(([name2, error2]) => /* @__PURE__ */ jsxs("div", { style: { fontSize: 12, marginTop: 5 }, children: [
              /* @__PURE__ */ jsxs("strong", { children: [
                name2,
                ":"
              ] }),
              " ",
              error2
            ] }, name2))
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: 12
          },
          children: [
            /* @__PURE__ */ jsx(
              StatCard,
              {
                icon: "🛠️",
                label: "Mjeshtër gjithsej",
                value: workers.length,
                hint: `${analytics.activeWorkers.length} aktivë · ${analytics.availableWorkers.length} të disponueshëm`,
                onClick: () => goTo("workers")
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                icon: "💎",
                label: "Anëtarë PRO",
                value: analytics.proWorkers.length,
                hint: `${analytics.proRate}% e mjeshtërve`,
                onClick: () => goTo("workers"),
                tone: "#8b5cf6"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                icon: "📞",
                label: "Kontaktet gjithsej",
                value: contacts.length,
                hint: `${analytics.recentContacts.length} në ${period2} ditët e fundit`,
                onClick: () => goTo("contacts"),
                tone: "#059669"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                icon: "⭐",
                label: "Reviews gjithsej",
                value: reviews.length,
                hint: `Mesatarja e regjistruar: ${analytics.averageRating.toFixed(2)} / 5`,
                onClick: () => goTo("reviews"),
                tone: "#d97706"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                icon: "🚩",
                label: "Raporte të hapura",
                value: analytics.openReports.length,
                hint: `${reports.length} raporte gjithsej`,
                onClick: () => goTo("reports"),
                tone: "#dc2626"
              }
            ),
            /* @__PURE__ */ jsx(
              StatCard,
              {
                icon: "🪪",
                label: "Verifikime në pritje",
                value: analytics.pendingVerifications.length,
                hint: `${analytics.verifiedWorkers.length} mjeshtër të verifikuar`,
                onClick: () => goTo("verifications"),
                tone: "#7c3aed"
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: styles$4.tabNavigation,
        "aria-label": "Admin navigation",
        style: { marginTop: 22, display: "flex", flexWrap: "wrap", gap: 7 },
        children: NAV.map((item) => {
          const active2 = activeTab2 === item.id;
          let badgeCount = null;
          if (item.id === "reports") badgeCount = analytics.openReports.length;
          if (item.id === "verifications")
            badgeCount = analytics.pendingVerifications.length;
          if (item.id === "reviewRequests")
            badgeCount = analytics.pendingReviewRequests.length;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: active2 ? styles$4.activeTab : "",
              onClick: () => goTo(item.id),
              children: [
                item.icon,
                " ",
                item.label,
                badgeCount > 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      marginLeft: 6,
                      padding: "2px 6px",
                      borderRadius: 99,
                      background: "#fee2e2",
                      color: "#b91c1c",
                      fontSize: 11
                    },
                    children: badgeCount
                  }
                )
              ]
            },
            item.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxs("main", { className: styles$4.tabContent, style: { minWidth: 0 }, children: [
      activeTab2 === "overview" && /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 18 }, children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            title: "Marketplace overview",
            description: "Një pamje e shpejtë e aktivitetit, rritjes dhe çështjeve që kërkojnë vëmendje.",
            action: /* @__PURE__ */ jsxs(
              "select",
              {
                value: period2,
                onChange: (event) => setPeriod(event.target.value),
                style: buttonStyle,
                "aria-label": "Periudha e analizës",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "7", children: "7 ditët e fundit" }),
                  /* @__PURE__ */ jsx("option", { value: "30", children: "30 ditët e fundit" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("div", { style: mutedStyle, children: "Aktiviteti gjatë periudhës" }),
                /* @__PURE__ */ jsx("h2", { style: { fontSize: 28, margin: "8px 0" }, children: analytics.recentContacts.length + analytics.recentReviews.length + analytics.recentReports.length }),
                /* @__PURE__ */ jsx("p", { style: mutedStyle, children: "Kontakte + reviews + raporte të krijuara në periudhën e zgjedhur." })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("div", { style: mutedStyle, children: "Përqindja e mjeshtërve aktivë" }),
                /* @__PURE__ */ jsxs("h2", { style: { fontSize: 28, margin: "8px 0" }, children: [
                  analytics.activeRate,
                  "%"
                ] }),
                /* @__PURE__ */ jsxs("p", { style: mutedStyle, children: [
                  analytics.activeWorkers.length,
                  " nga ",
                  workers.length,
                  " mjeshtër kanë isActive = true."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("div", { style: mutedStyle, children: "Review-t e verifikuara" }),
                /* @__PURE__ */ jsxs("h2", { style: { fontSize: 28, margin: "8px 0" }, children: [
                  analytics.reviewVerificationRate,
                  "%"
                ] }),
                /* @__PURE__ */ jsxs("p", { style: mutedStyle, children: [
                  analytics.verifiedReviews.length,
                  " nga ",
                  reviews.length,
                  " ",
                  "reviews kanë isVerified = true."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("div", { style: mutedStyle, children: "Mjeshtër me profil të verifikuar" }),
                /* @__PURE__ */ jsxs("h2", { style: { fontSize: 28, margin: "8px 0" }, children: [
                  analytics.verifiedRate,
                  "%"
                ] }),
                /* @__PURE__ */ jsxs("p", { style: mutedStyle, children: [
                  analytics.verifiedWorkers.length,
                  " nga ",
                  workers.length,
                  " ",
                  "profile."
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 16
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("h3", { style: { marginTop: 0 }, children: "Aktiviteti ditor" }),
                /* @__PURE__ */ jsx("p", { style: mutedStyle, children: "Kontakte, reviews, raporte dhe regjistrime." }),
                /* @__PURE__ */ jsx("div", { style: { height: 280 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: analytics.timeline, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: { fontSize: 10 } }),
                  /* @__PURE__ */ jsx(YAxis, { allowDecimals: false }),
                  /* @__PURE__ */ jsx(Tooltip, {}),
                  /* @__PURE__ */ jsx(Legend, {}),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "Kontakte",
                      stroke: "#2563eb"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "Reviews",
                      stroke: "#10b981"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "Raporte",
                      stroke: "#ef4444"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "Regjistrime",
                      stroke: "#8b5cf6"
                    }
                  )
                ] }) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("h3", { style: { marginTop: 0 }, children: "Basic vs PRO" }),
                /* @__PURE__ */ jsx("p", { style: mutedStyle, children: "Ndarja e mjeshtërve sipas planit." }),
                /* @__PURE__ */ jsx("div", { style: { height: 240 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
                  /* @__PURE__ */ jsx(
                    Pie,
                    {
                      data: [
                        { name: "PRO", value: analytics.proWorkers.length },
                        {
                          name: "Basic",
                          value: Math.max(
                            0,
                            workers.length - analytics.proWorkers.length
                          )
                        }
                      ],
                      dataKey: "value",
                      nameKey: "name",
                      innerRadius: 55,
                      outerRadius: 85,
                      paddingAngle: 4,
                      children: [0, 1].map((index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[index] }, index))
                    }
                  ),
                  /* @__PURE__ */ jsx(Tooltip, {}),
                  /* @__PURE__ */ jsx(Legend, {})
                ] }) }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Qytetet me më shumë mjeshtër",
              description: "Shpërndarja sipas fushës city të koleksionit workers."
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
                gap: 10
              },
              children: analytics.cityBreakdown.slice(0, 8).map((city2) => /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: 14,
                    borderRadius: 10,
                    background: "var(--admin-subtle, #f8fafc)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { style: mutedStyle, children: city2.name }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: { fontSize: 24, fontWeight: 800, marginTop: 6 },
                        children: city2.value
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { style: mutedStyle, children: [
                      percentage(city2.value, workers.length),
                      "% e profileve"
                    ] })
                  ]
                },
                city2.name
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Qendra e vëmendjes",
              description: "Çështje që mund të kërkojnë veprim nga administratori."
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12
              },
              children: [
                {
                  title: "Raporte të hapura",
                  count: analytics.openReports.length,
                  color: "#dc2626",
                  tab: "reports",
                  desc: "Kontrollo ankesat e përdoruesve."
                },
                {
                  title: "Verifikime në pritje",
                  count: analytics.pendingVerifications.length,
                  color: "#7c3aed",
                  tab: "verifications",
                  desc: "Kontrollo kërkesat e verifikimit."
                },
                {
                  title: "Review requests në pritje",
                  count: analytics.pendingReviewRequests.length,
                  color: "#d97706",
                  tab: "reviewRequests",
                  desc: "Shiko kërkesat e pambyllura."
                },
                {
                  title: "Reviews me sinjal pajisjeje",
                  count: analytics.suspiciousReviews.length,
                  color: "#b45309",
                  tab: "reviews",
                  desc: "isDifferentDevice = true; kërko kontekst."
                }
              ].map((item) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => goTo(item.tab),
                  style: {
                    ...buttonStyle,
                    padding: 15,
                    textAlign: "left",
                    whiteSpace: "normal"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { color: item.color, fontWeight: 800 }, children: [
                      item.count,
                      " · ",
                      item.title
                    ] }),
                    /* @__PURE__ */ jsx("p", { style: { ...mutedStyle, marginBottom: 0 }, children: item.desc })
                  ]
                },
                item.title
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Aktiviteti më i fundit",
              description: "Regjistrime, kontakte, reviews, raporte dhe verifikime."
            }
          ),
          /* @__PURE__ */ jsx(
            SimpleTable,
            {
              columns: [
                { key: "activityType", label: "Lloji" },
                { key: "activityName", label: "Përshkrimi" },
                {
                  key: "workerId",
                  label: "Mjeshtri",
                  render: (item) => {
                    const worker = workerById.get(item.workerId);
                    return (worker == null ? void 0 : worker.fullName) || item.workerName || item.workerId || "—";
                  }
                },
                {
                  key: "createdAt",
                  label: "Data",
                  render: (item) => dateTimeLabel(item.createdAt)
                },
                {
                  key: "status",
                  label: "Statusi",
                  render: (item) => /* @__PURE__ */ jsx(Badge, { children: item.status || item.activityType })
                }
              ],
              rows: recentActivity
            }
          )
        ] })
      ] }),
      activeTab2 === "categorySugg" && /* @__PURE__ */ jsxs(
        "section",
        {
          style: {
            padding: "24px",
            marginTop: "24px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px"
          },
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "20px"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { style: { margin: 0, color: "#111827" }, children: "Sugjerime për kategori" }),
                    /* @__PURE__ */ jsx("p", { style: { margin: "6px 0 0", color: "#6b7280" }, children: "Kategoritë e propozuara nga punëtorët." })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: loadCategorySuggestions,
                      disabled: loadingSuggestions,
                      style: {
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#004cff",
                        color: "#fff",
                        cursor: loadingSuggestions ? "wait" : "pointer"
                      },
                      children: loadingSuggestions ? "Duke ngarkuar..." : "Rifresko"
                    }
                  )
                ]
              }
            ),
            suggestionError && /* @__PURE__ */ jsx("p", { style: { color: "#dc2626" }, children: suggestionError }),
            loadingSuggestions ? /* @__PURE__ */ jsx("p", { style: { color: "#6b7280" }, children: "Duke ngarkuar sugjerimet..." }) : !suggestionError && categorySuggestions.length === 0 ? /* @__PURE__ */ jsx("p", { style: { color: "#6b7280" }, children: "Nuk ka sugjerime të reja për momentin." }) : /* @__PURE__ */ jsx("div", { style: { display: "grid", gap: "14px" }, children: categorySuggestions.map((suggestion) => {
              var _a3;
              return /* @__PURE__ */ jsxs(
                "article",
                {
                  style: {
                    padding: "18px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    minWidth: 0
                  },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "12px",
                          flexWrap: "wrap"
                        },
                        children: [
                          /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
                            /* @__PURE__ */ jsx(
                              "h3",
                              {
                                style: {
                                  margin: "0 0 12px",
                                  color: "#111827",
                                  fontSize: "20px"
                                },
                                children: suggestion.suggestedCategory || "Pa emër"
                              }
                            ),
                            /* @__PURE__ */ jsxs("p", { style: { margin: "4px 0", color: "#374151" }, children: [
                              /* @__PURE__ */ jsx("strong", { children: "Punëtori:" }),
                              " ",
                              suggestion.workerName || "Nuk është dhënë"
                            ] }),
                            /* @__PURE__ */ jsxs(
                              "p",
                              {
                                style: {
                                  margin: "4px 0",
                                  color: "#374151",
                                  overflowWrap: "anywhere"
                                },
                                children: [
                                  /* @__PURE__ */ jsx("strong", { children: "Email:" }),
                                  " ",
                                  suggestion.workerEmail || "Nuk është dhënë"
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxs("p", { style: { margin: "4px 0", color: "#374151" }, children: [
                              /* @__PURE__ */ jsx("strong", { children: "Qyteti:" }),
                              " ",
                              suggestion.city || "Nuk është dhënë"
                            ] }),
                            /* @__PURE__ */ jsx(
                              "p",
                              {
                                style: {
                                  margin: "8px 0 0",
                                  color: "#6b7280",
                                  fontSize: "13px"
                                },
                                children: ((_a3 = suggestion.createdAt) == null ? void 0 : _a3.toDate) ? suggestion.createdAt.toDate().toLocaleString() : "Data nuk është e disponueshme"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              style: {
                                padding: "6px 10px",
                                borderRadius: "20px",
                                background: "#fef3c7",
                                color: "#92400e",
                                fontSize: "12px",
                                fontWeight: 600,
                                whiteSpace: "nowrap"
                              },
                              children: suggestion.status === "pending" ? "Në pritje" : suggestion.status || "Pa status"
                            }
                          )
                        ]
                      }
                    ),
                    suggestion.status === "pending" && /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          gap: "10px",
                          marginTop: "18px",
                          flexWrap: "wrap"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => approveCategorySuggestion(suggestion),
                              disabled: processingSuggestion !== null,
                              style: {
                                padding: "9px 16px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#16a34a",
                                color: "#fff",
                                cursor: processingSuggestion ? "wait" : "pointer",
                                opacity: processingSuggestion ? 0.6 : 1
                              },
                              children: processingSuggestion === suggestion.id ? "Duke përpunuar..." : "Aprovo"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => declineCategorySuggestion(suggestion),
                              disabled: processingSuggestion !== null,
                              style: {
                                padding: "9px 16px",
                                border: "1px solid #dc2626",
                                borderRadius: "8px",
                                background: "#fff",
                                color: "#dc2626",
                                cursor: processingSuggestion ? "wait" : "pointer",
                                opacity: processingSuggestion ? 0.6 : 1
                              },
                              children: "Refuzo"
                            }
                          )
                        ]
                      }
                    )
                  ]
                },
                suggestion.id
              );
            }) })
          ]
        }
      ),
      activeTab2 === "analytics" && /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 18 }, children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            title: "Advanced analytics",
            description: "Analizë e aktivitetit, cilësisë së shërbimit dhe strukturës së marketplace-it.",
            action: /* @__PURE__ */ jsxs(
              "select",
              {
                value: period2,
                onChange: (event) => setPeriod(event.target.value),
                style: buttonStyle,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "7", children: "7 ditë" }),
                  /* @__PURE__ */ jsx("option", { value: "30", children: "30 ditë" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "📞",
                  label: "Kontaktet e periudhës",
                  value: analytics.recentContacts.length
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "⭐",
                  label: "Reviews të periudhës",
                  value: analytics.recentReviews.length
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "🛠️",
                  label: "Regjistrime të reja",
                  value: analytics.recentWorkers.length
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "🚩",
                  label: "Raporte të periudhës",
                  value: analytics.recentReports.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("h3", { style: { marginTop: 0 }, children: "Kategoritë e mjeshtërve" }),
                /* @__PURE__ */ jsx("div", { style: { height: 300 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
                  BarChart,
                  {
                    data: analytics.categoryBreakdown.slice(0, 10),
                    layout: "vertical",
                    children: [
                      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
                      /* @__PURE__ */ jsx(XAxis, { type: "number", allowDecimals: false }),
                      /* @__PURE__ */ jsx(
                        YAxis,
                        {
                          type: "category",
                          dataKey: "name",
                          width: 100,
                          tick: { fontSize: 11 }
                        }
                      ),
                      /* @__PURE__ */ jsx(Tooltip, {}),
                      /* @__PURE__ */ jsx(
                        Bar,
                        {
                          dataKey: "value",
                          fill: "#2563eb",
                          radius: [0, 5, 5, 0]
                        }
                      )
                    ]
                  }
                ) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("h3", { style: { marginTop: 0 }, children: "Vlerësimet" }),
                /* @__PURE__ */ jsx("p", { style: mutedStyle, children: "Mesatarja e ratings numerike në koleksionin reviews." }),
                /* @__PURE__ */ jsx("div", { style: { height: 280 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: analytics.ratingsBreakdown, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name" }),
                  /* @__PURE__ */ jsx(YAxis, { allowDecimals: false }),
                  /* @__PURE__ */ jsx(Tooltip, {}),
                  /* @__PURE__ */ jsx(
                    Bar,
                    {
                      dataKey: "value",
                      fill: "#f59e0b",
                      radius: [5, 5, 0, 0]
                    }
                  )
                ] }) }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
                /* @__PURE__ */ jsx("h3", { style: { marginTop: 0 }, children: "Kategoritë e raporteve" }),
                /* @__PURE__ */ jsx("div", { style: { height: 280 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: analytics.reportCategories.slice(0, 8), children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", tick: { fontSize: 10 } }),
                  /* @__PURE__ */ jsx(YAxis, { allowDecimals: false }),
                  /* @__PURE__ */ jsx(Tooltip, {}),
                  /* @__PURE__ */ jsx(
                    Bar,
                    {
                      dataKey: "value",
                      fill: "#ef4444",
                      radius: [5, 5, 0, 0]
                    }
                  )
                ] }) }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Mjeshtrit me më shumë kontakte",
              description: "Renditje nga numri i contactSessions që lidhen me workerId.",
              action: /* @__PURE__ */ jsx(
                "button",
                {
                  style: buttonStyle,
                  onClick: () => exportCsv(
                    analytics.workerPerformance,
                    "worker-performance.csv"
                  ),
                  children: "Eksporto CSV"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            SimpleTable,
            {
              columns: [
                { key: "name", label: "Mjeshtri" },
                { key: "city", label: "Qyteti" },
                { key: "category", label: "Kategoria" },
                { key: "contacts", label: "Kontaktet" },
                { key: "reviews", label: "Reviews" },
                {
                  key: "rating",
                  label: "Mesatarja",
                  render: (item) => `${Number(item.rating).toFixed(2)} ⭐`
                },
                {
                  key: "reports",
                  label: "Raporte",
                  render: (item) => /* @__PURE__ */ jsx(Badge, { color: item.reports ? "#dc2626" : "#64748b", children: item.reports })
                },
                {
                  key: "isPro",
                  label: "Plani",
                  render: (item) => /* @__PURE__ */ jsx(Badge, { color: item.isPro ? "#7c3aed" : "#64748b", children: item.isPro ? "PRO" : "Basic" })
                }
              ],
              rows: analytics.topWorkers
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Mjeshtrit me vlerësimet më të larta",
              description: "Shfaqen vetëm profilet që kanë të paktën një review të lidhur."
            }
          ),
          /* @__PURE__ */ jsx(
            SimpleTable,
            {
              columns: [
                { key: "name", label: "Mjeshtri" },
                { key: "city", label: "Qyteti" },
                { key: "category", label: "Kategoria" },
                {
                  key: "rating",
                  label: "Rating",
                  render: (item) => `${Number(item.rating).toFixed(2)} ⭐`
                },
                { key: "reviews", label: "Numri i reviews" },
                { key: "contacts", label: "Kontaktet" }
              ],
              rows: analytics.highestRated
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Raportet sipas statusit",
              description: "Ndihmon për të parë ku grumbullohen raportet."
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 }, children: analytics.reportStatuses.map((item, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                padding: 13,
                borderRadius: 10,
                background: "var(--admin-subtle, #f8fafc)",
                minWidth: 125
              },
              children: [
                /* @__PURE__ */ jsx("div", { style: mutedStyle, children: item.name }),
                /* @__PURE__ */ jsx("strong", { style: { fontSize: 24 }, children: item.value })
              ]
            },
            item.name
          )) })
        ] })
      ] }),
      activeTab2 === "workers" && /* @__PURE__ */ jsx(AdminWorkers, {}),
      activeTab2 === "reports" && /* @__PURE__ */ jsx(AdminReports, { user }),
      activeTab2 === "reviews" && /* @__PURE__ */ jsx(AdminReviews, {}),
      activeTab2 === "verifications" && /* @__PURE__ */ jsx(
        AdminVerifications,
        {
          setGlobalCount: (count) => {
            if (typeof count === "number") return;
          }
        }
      ),
      activeTab2 === "contacts" && /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 18 }, children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            title: "Contact intelligence",
            description: "Analizo kërkesat për kontakt, kërkesën për mjeshtër dhe lidhjet e mundshme me reviews.",
            action: /* @__PURE__ */ jsx(
              "button",
              {
                style: buttonStyle,
                onClick: () => exportCsv(contacts, "gjejnjerin-contact-sessions.csv"),
                children: "⬇ Eksporto kontaktet"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "📞",
                  label: "Contact sessions",
                  value: contacts.length
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "🔗",
                  label: "Me sinjal të përputhur review",
                  value: analytics.contactsWithReview.length,
                  hint: "Përputhje sipas workerId dhe telefonit ose fingerprint-it."
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "📊",
                  label: "Përputhje / kontakte",
                  value: `${analytics.contactRate}%`,
                  hint: "Sinjal eksplorues, jo normë e garantuar konvertimi."
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "🧾",
                  label: "Për review",
                  value: contacts.filter((item) => item.usedForReview === true).length,
                  hint: "usedForReview = true."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Mjeshtrit me më shumë kërkesa kontakti",
              description: "Numri i session-eve sipas workerId."
            }
          ),
          /* @__PURE__ */ jsx(
            SimpleTable,
            {
              columns: [
                { key: "name", label: "Mjeshtri" },
                { key: "value", label: "Kontakte" }
              ],
              rows: analytics.contactsByWorker
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Të gjitha kontaktet",
              description: "Regjistrat e contactSessions me lidhjen te profili i mjeshtrit."
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: search,
              onChange: (event) => setSearch(event.target.value),
              placeholder: "Kërko emër, telefon, worker ID ose fingerprint...",
              style: {
                ...buttonStyle,
                width: "100%",
                marginBottom: 14,
                boxSizing: "border-box"
              }
            }
          ),
          /* @__PURE__ */ jsx(
            SimpleTable,
            {
              columns: [
                { key: "customerName", label: "Klienti" },
                { key: "customerPhone", label: "Telefoni" },
                {
                  key: "worker",
                  label: "Mjeshtri",
                  render: (item) => {
                    var _a3;
                    return ((_a3 = workerById.get(item.workerId)) == null ? void 0 : _a3.fullName) || item.workerId || "—";
                  }
                },
                {
                  key: "createdAt",
                  label: "Data",
                  render: (item) => dateTimeLabel(item.createdAt)
                },
                {
                  key: "status",
                  label: "Statusi",
                  render: (item) => /* @__PURE__ */ jsx(Badge, { children: item.status })
                },
                {
                  key: "usedForReview",
                  label: "Review",
                  render: (item) => item.usedForReview ? /* @__PURE__ */ jsx(Badge, { color: "#059669", children: "Përdorur" }) : /* @__PURE__ */ jsx(Badge, { children: "Jo" })
                },
                {
                  key: "fingerPrint",
                  label: "Fingerprint",
                  render: (item) => /* @__PURE__ */ jsx("span", { title: item.fingerPrint || "", children: item.fingerPrint ? `${String(item.fingerPrint).slice(0, 10)}…` : "—" })
                }
              ],
              rows: contacts.filter((item) => {
                const term = normalize(search);
                return !term || [
                  item.customerName,
                  item.customerPhone,
                  item.workerId,
                  item.fingerPrint,
                  item.status
                ].some((value) => normalize(value).includes(term));
              })
            }
          )
        ] })
      ] }),
      activeTab2 === "reviewRequests" && /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 18 }, children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            title: "Review request operations",
            description: "Ndiq kërkesat për review dhe lidhjet me kontaktet dhe reviews.",
            action: /* @__PURE__ */ jsx(
              "button",
              {
                style: buttonStyle,
                onClick: () => exportCsv(reviewRequests, "gjejnjerin-review-requests.csv"),
                children: "⬇ Eksporto"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "✉️",
                  label: "Kërkesa gjithsej",
                  value: reviewRequests.length
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "⏳",
                  label: "Të hapura",
                  value: analytics.pendingReviewRequests.length,
                  tone: "#d97706"
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "⭐",
                  label: "Reviews gjithsej",
                  value: reviews.length
                }
              ),
              /* @__PURE__ */ jsx(
                StatCard,
                {
                  icon: "🔗",
                  label: "Me session të lidhur",
                  value: reviewRequests.filter(
                    (item) => item.sessionId && contactById.has(item.sessionId)
                  ).length,
                  hint: "Lidhje direkte përmes sessionId."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Kërkesat sipas statusit",
              description: "Shpërndarja e reviewRequest.status."
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 10 }, children: countBy(
            reviewRequests,
            (item) => item.status || "Pa status"
          ).map((item) => /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                padding: 14,
                borderRadius: 10,
                background: "var(--admin-subtle, #f8fafc)",
                minWidth: 120
              },
              children: [
                /* @__PURE__ */ jsx("div", { style: mutedStyle, children: item.name }),
                /* @__PURE__ */ jsx("strong", { style: { fontSize: 24 }, children: item.value })
              ]
            },
            item.name
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsx(
            SectionTitle,
            {
              title: "Kërkesat për review",
              description: "Përputhja me contactSessions bëhet përmes sessionId."
            }
          ),
          /* @__PURE__ */ jsx(
            SimpleTable,
            {
              columns: [
                { key: "customerName", label: "Klienti" },
                { key: "customerPhone", label: "Telefoni" },
                { key: "workerName", label: "Mjeshtri" },
                {
                  key: "workerId",
                  label: "Profili",
                  render: (item) => {
                    var _a3;
                    return /* @__PURE__ */ jsx("span", { children: ((_a3 = workerById.get(item.workerId)) == null ? void 0 : _a3.fullName) || item.workerId || "—" });
                  }
                },
                {
                  key: "sessionId",
                  label: "Contact session",
                  render: (item) => /* @__PURE__ */ jsx("span", { children: item.sessionId ? contactById.has(item.sessionId) ? "E lidhur ✓" : "ID ekziston, por nuk u gjet session" : "Pa sessionId" })
                },
                {
                  key: "createdAt",
                  label: "Krijuar",
                  render: (item) => dateTimeLabel(item.createdAt)
                },
                {
                  key: "status",
                  label: "Statusi",
                  render: (item) => /* @__PURE__ */ jsx(
                    Badge,
                    {
                      color: isOpenStatus(item.status) ? "#d97706" : "#059669",
                      children: item.status
                    }
                  )
                }
              ],
              rows: [...reviewRequests].sort(
                (a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt)
              )
            }
          )
        ] })
      ] }),
      activeTab2 === "explorer" && /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 18 }, children: [
        /* @__PURE__ */ jsx(
          SectionTitle,
          {
            title: "Firestore Data Explorer",
            description: "Kërko, filtro dhe eksporto regjistrat që administratori ka leje t'i lexojë.",
            action: /* @__PURE__ */ jsxs(
              "button",
              {
                style: buttonStyle,
                onClick: () => exportCsv(explorerRows, `${selectedCollection}-export.csv`),
                children: [
                  "⬇ Eksporto rezultatet (",
                  explorerRows.length,
                  ")"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: panelStyle, children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12
              },
              children: [
                /* @__PURE__ */ jsxs("label", { style: { display: "grid", gap: 6, fontSize: 13 }, children: [
                  "Koleksioni",
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: selectedCollection,
                      onChange: (event) => {
                        setSelectedCollection(event.target.value);
                        setStatusFilter("all");
                        setSearch("");
                      },
                      style: buttonStyle,
                      children: COLLECTIONS.map((item) => /* @__PURE__ */ jsxs("option", { value: item.id, children: [
                        item.icon,
                        " ",
                        item.label
                      ] }, item.id))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("label", { style: { display: "grid", gap: 6, fontSize: 13 }, children: [
                  "Kërko në regjistra",
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: search,
                      onChange: (event) => setSearch(event.target.value),
                      placeholder: "Emër, ID, kategori...",
                      style: buttonStyle
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("label", { style: { display: "grid", gap: 6, fontSize: 13 }, children: [
                  "Statusi",
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: statusFilter,
                      onChange: (event) => setStatusFilter(event.target.value),
                      style: buttonStyle,
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "all", children: "Të gjitha statuset" }),
                        allStatuses.map((status2) => /* @__PURE__ */ jsx("option", { value: status2, children: status2 }, status2))
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { style: { ...mutedStyle, marginTop: 14 }, children: loaded[selectedCollection] ? `${collectionName}: ${explorerRows.length} rezultate nga ${(records[selectedCollection] || []).length} regjistra të lexuar.` : "Duke ngarkuar të dhënat..." })
        ] }),
        /* @__PURE__ */ jsx("div", { style: panelStyle, children: /* @__PURE__ */ jsx(
          SimpleTable,
          {
            columns: [
              {
                key: "id",
                label: "Document ID",
                render: (item) => /* @__PURE__ */ jsx("code", { style: { fontSize: 11 }, children: item.id })
              },
              {
                key: "name",
                label: "Emri / Titulli",
                render: (item) => item.fullName || item.workerName || item.customerName || item.title || item.searchName || item.id
              },
              {
                key: "workerId",
                label: "Worker ID",
                render: (item) => item.workerId || item.reportedUserId || "—"
              },
              {
                key: "status",
                label: "Statusi",
                render: (item) => /* @__PURE__ */ jsx(Badge, { children: item.status })
              },
              {
                key: "createdAt",
                label: "Krijuar",
                render: (item) => dateTimeLabel(item.createdAt)
              },
              {
                key: "details",
                label: "Detajet",
                render: (item) => /* @__PURE__ */ jsxs("details", { children: [
                  /* @__PURE__ */ jsx("summary", { style: { cursor: "pointer" }, children: "Shfaq fushat" }),
                  /* @__PURE__ */ jsx(
                    "pre",
                    {
                      style: {
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        maxWidth: 420,
                        fontSize: 11
                      },
                      children: JSON.stringify(
                        Object.fromEntries(
                          Object.entries(item).filter(
                            ([key]) => key !== "storagePath"
                          )
                        ),
                        (key, value) => {
                          if (value && typeof value.toDate === "function") {
                            return value.toDate().toISOString();
                          }
                          return value;
                        },
                        2
                      )
                    }
                  )
                ] })
              }
            ],
            rows: explorerRows
          }
        ) })
      ] })
    ] }),
    isNotesOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: styles$4.notesOverlay,
        onClick: () => setIsNotesOpen(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: styles$4.notesDrawer,
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: styles$4.drawerHeader, children: [
                /* @__PURE__ */ jsx("h3", { children: "Shënimet e Adminit 📌" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: styles$4.closeDrawerBtn,
                    onClick: () => setIsNotesOpen(false),
                    children: "✕"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: styles$4.noteInputGroup, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: noteRef,
                    type: "text",
                    placeholder: "Shkruaj një shënim të ri...",
                    className: styles$4.noteInput,
                    onKeyDown: (event) => {
                      if (event.key === "Enter") addNote();
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: addNote,
                    className: styles$4.noteSaveBtn,
                    children: "Ruaj"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("ul", { className: styles$4.notesList, children: adminNotes.length === 0 ? /* @__PURE__ */ jsx("p", { className: styles$4.noNotes, children: "Nuk ka shënime për momentin." }) : adminNotes.map((note, index) => /* @__PURE__ */ jsxs(
                "li",
                {
                  className: styles$4.noteItem,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: styles$4.noteContent, children: [
                      /* @__PURE__ */ jsx("span", { className: styles$4.noteText, children: note.text }),
                      /* @__PURE__ */ jsx("span", { className: styles$4.noteTime, children: note.timestamp })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteNote(index),
                        className: styles$4.deleteNoteBtn,
                        "aria-label": "Fshi shënimin",
                        children: "🗑️"
                      }
                    )
                  ]
                },
                `${note.timestamp}-${index}`
              )) })
            ]
          }
        )
      }
    )
  ] });
}
function AdminEnroll() {
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [smsCode, setSmsCode] = useState("");
  const [step2, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-enroll-container", {
        size: "invisible"
      });
    }
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);
  const sendSms = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Ju lutem hyni në llogari fillimisht!");
      await user.reload();
      const session = await multiFactor(user).getSession();
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const vId = await phoneAuthProvider.verifyPhoneNumber(
        { phoneNumber: phone.replace(/\s+/g, ""), session },
        recaptchaRef.current
      );
      setVerificationId(vId);
      setStep(2);
      alert("Kodi u dërgua (Nëse po përdorni numër testues, kodi është ai që keni vendosur në Console)");
    } catch (err) {
      console.error("MFA Enrollment Error:", err);
      alert("Gabim: " + err.message);
      if (window.grecaptcha) window.grecaptcha.reset();
    } finally {
      setLoading(false);
    }
  };
  const finishEnrollment = async () => {
    try {
      const user = auth.currentUser;
      const cred = PhoneAuthProvider.credential(verificationId, smsCode);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(user).enroll(assertion, "Admin Phone");
      alert("SUKSES! Llogaria juaj tani mbrohet me 2FA.");
    } catch (err) {
      console.error("Final Enrollment Error:", err);
      alert("Kodi i pasaktë!");
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: { padding: "50px", textAlign: "center", fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsx("h2", { children: "Security: Admin Enrollment" }),
    /* @__PURE__ */ jsx("div", { id: "recaptcha-enroll-container" }),
    step2 === 1 ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "+38345777888",
          value: phone,
          onChange: (e) => setPhone(e.target.value),
          style: { padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: sendSms,
          disabled: loading,
          style: { padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" },
          children: loading ? "Duke u procesuar..." : "Dërgo Kodin"
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Shkruaj kodin 6-shifror",
          value: smsCode,
          onChange: (e) => setSmsCode(e.target.value),
          style: { padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: finishEnrollment,
          style: { padding: "12px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" },
          children: "Verifiko & Aktivizo"
        }
      )
    ] })
  ] });
}
const pageWrapper = "_pageWrapper_1219j_17";
const topBar = "_topBar_1219j_21";
const mainTitle = "_mainTitle_1219j_35";
const liveIndicator = "_liveIndicator_1219j_39";
const pulse = "_pulse_1219j_1";
const filterPills = "_filterPills_1219j_59";
const pill = "_pill_1219j_61";
const pillActive = "_pillActive_1219j_61";
const contentArea = "_contentArea_1219j_69";
const sectionLabel$1 = "_sectionLabel_1219j_91";
const mainGrid = "_mainGrid_1219j_97";
const eliteItem = "_eliteItem_1219j_123";
const challengerItem = "_challengerItem_1219j_123";
const cardEnter = "_cardEnter_1219j_1";
const trendIndicator = "_trendIndicator_1219j_153";
const trendArrow = "_trendArrow_1219j_167";
const trendText = "_trendText_1219j_169";
const rising = "_rising_1219j_175";
const falling = "_falling_1219j_177";
const stable = "_stable_1219j_179";
const loaderContainer = "_loaderContainer_1219j_197";
const spinner$1 = "_spinner_1219j_199";
const spin = "_spin_1219j_199";
const livePulse = "_livePulse_1219j_231";
const popIn = "_popIn_1219j_1";
const styles$3 = {
  pageWrapper,
  topBar,
  mainTitle,
  liveIndicator,
  pulse,
  filterPills,
  pill,
  pillActive,
  contentArea,
  sectionLabel: sectionLabel$1,
  mainGrid,
  eliteItem,
  challengerItem,
  cardEnter,
  trendIndicator,
  trendArrow,
  trendText,
  rising,
  falling,
  stable,
  loaderContainer,
  spinner: spinner$1,
  spin,
  livePulse,
  popIn,
  "glow-green": "_glow-green_1219j_1"
};
function MostWanted() {
  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState("Gjitha");
  const [loading, setLoading] = useState(true);
  const prevScores = useRef({});
  const isFirstLoad = useRef(true);
  const categories2 = ["Gjitha", "Elektricist", "Instalues", "Moler", "Kopshtar"];
  const getScore = (w) => {
    let score2 = 0;
    if (w.isPro) score2 += 1e3;
    if (w.isVerified) score2 += 200;
    score2 += Number(w.reviewCount || 0) * 5;
    return score2;
  };
  useEffect(() => {
    const q = query(
      collection(db, "workers"),
      orderBy("isPro", "desc"),
      orderBy("reviewCount", "desc"),
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData = snapshot.docs.map((doc2) => {
        const data = { id: doc2.id, ...doc2.data() };
        const currentScore = getScore(data);
        const previousScore = prevScores.current[doc2.id];
        let trend = "stable";
        if (!isFirstLoad.current && previousScore !== void 0) {
          if (currentScore > previousScore) trend = "rising";
          else if (currentScore < previousScore) trend = "falling";
        }
        prevScores.current[doc2.id] = currentScore;
        return { ...data, currentScore, trend };
      });
      setWorkers(liveData.sort((a, b) => b.currentScore - a.currentScore));
      setLoading(false);
      isFirstLoad.current = false;
    });
    return () => unsubscribe();
  }, []);
  const filtered = workers.filter((w) => filter === "Gjitha" || w.category === filter);
  const renderWorker = (worker, index, isElite) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: isElite ? styles$3.eliteItem : styles$3.challengerItem,
      "data-rank": index + 1,
      children: [
        worker.trend !== "stable" && /* @__PURE__ */ jsxs("div", { className: `${styles$3.trendIndicator} ${styles$3[worker.trend]}`, children: [
          /* @__PURE__ */ jsx("span", { className: styles$3.trendArrow, children: worker.trend === "rising" ? "▲" : "▼" }),
          /* @__PURE__ */ jsx("span", { className: styles$3.trendText, children: worker.trend === "rising" ? "LIVE NGJITJE" : "RËNIE" })
        ] }),
        /* @__PURE__ */ jsx(WorkerCard, { worker, verifyIcon: true })
      ]
    },
    worker.id
  );
  return /* @__PURE__ */ jsxs("div", { className: styles$3.pageWrapper, children: [
    /* @__PURE__ */ jsxs("header", { className: styles$3.topBar, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$3.titleSection, children: [
        /* @__PURE__ */ jsx("span", { className: styles$3.liveIndicator, children: "LIVE RANKING" }),
        /* @__PURE__ */ jsx("h1", { className: styles$3.mainTitle, children: "Më të kërkuarit" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: styles$3.filterPills, children: categories2.map((cat) => /* @__PURE__ */ jsx(
        "button",
        {
          className: filter === cat ? styles$3.pillActive : styles$3.pill,
          onClick: () => setFilter(cat),
          children: cat
        },
        cat
      )) })
    ] }),
    /* @__PURE__ */ jsx("main", { className: styles$3.contentArea, children: loading ? /* @__PURE__ */ jsx("div", { className: styles$3.loaderContainer, children: /* @__PURE__ */ jsx("div", { className: styles$3.spinner }) }) : /* @__PURE__ */ jsxs("div", { className: styles$3.gridContainer, children: [
      /* @__PURE__ */ jsx("div", { className: styles$3.sectionLabel, children: "Elite Tier" }),
      /* @__PURE__ */ jsx("div", { className: styles$3.mainGrid, children: filtered.slice(0, 3).map((w, i) => renderWorker(w, i, true)) }),
      /* @__PURE__ */ jsx("div", { className: styles$3.sectionLabel, style: { marginTop: "4rem" }, children: "Top Sfiduesit" }),
      /* @__PURE__ */ jsx("div", { className: styles$3.mainGrid, children: filtered.slice(3, 6).map((w, i) => renderWorker(w, i + 3, false)) })
    ] }) })
  ] });
}
const container$2 = "_container_1t1s7_1";
const card$1 = "_card_1t1s7_19";
const title$2 = "_title_1t1s7_39";
const subtitle = "_subtitle_1t1s7_51";
const priceBox = "_priceBox_1t1s7_61";
const price = "_price_1t1s7_61";
const period = "_period_1t1s7_79";
const features = "_features_1t1s7_89";
const sectionTitle = "_sectionTitle_1t1s7_113";
const button = "_button_1t1s7_125";
const classes = {
  container: container$2,
  card: card$1,
  title: title$2,
  subtitle,
  priceBox,
  price,
  period,
  features,
  sectionTitle,
  button
};
function PricingPage() {
  return /* @__PURE__ */ jsx("main", { className: classes.container, children: /* @__PURE__ */ jsxs("section", { className: classes.card, children: [
    /* @__PURE__ */ jsx("h1", { className: classes.title, children: "PRO Membership" }),
    /* @__PURE__ */ jsx("p", { className: classes.subtitle, children: "Zhblloko të gjitha mundësitë dhe rrit biznesin tënd 🚀" }),
    /* @__PURE__ */ jsxs("div", { className: classes.priceBox, children: [
      /* @__PURE__ */ jsx("span", { className: classes.price, children: "€14.99" }),
      /* @__PURE__ */ jsx("span", { className: classes.period, children: "/muaj" })
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: classes.features, children: [
      /* @__PURE__ */ jsx("li", { children: "🚀 Renditje Prioritare në kërkime." }),
      /* @__PURE__ */ jsx("li", { children: "💎 Distinktiv i Verifikuar" }),
      /* @__PURE__ */ jsx("li", { children: "🖼️ Portofolio pa limit" }),
      /* @__PURE__ */ jsx("li", { children: "🔗 Link publik i profilit" }),
      /* @__PURE__ */ jsx("li", { children: '⚡ Distinktiv "Reagim i shpejtë"' }),
      /* @__PURE__ */ jsx("li", { children: "⭐ Shfaqje PRO në profil" })
    ] }),
    /* @__PURE__ */ jsx("h3", { className: classes.sectionTitle, children: "Paneli i Performancës" }),
    /* @__PURE__ */ jsxs("ul", { className: classes.features, children: [
      /* @__PURE__ */ jsx("li", { children: "📊 Statistika LIVE (klikime, interesim)" }),
      /* @__PURE__ */ jsx("li", { children: "⭐ Reputacion & vlerësime" }),
      /* @__PURE__ */ jsx("li", { children: "🎯 Shkalla e konvertimit" }),
      /* @__PURE__ */ jsx("li", { children: "🕒 Aktiviteti i fundit" }),
      /* @__PURE__ */ jsx("li", { children: "🔒 Të dhëna private vetëm për ju" })
    ] }),
    /* @__PURE__ */ jsx("button", { className: classes.button, children: "Vazhdo te pagesa" })
  ] }) });
}
const container$1 = "_container_i21hl_3";
const title$1 = "_title_i21hl_27";
const date = "_date_i21hl_53";
const leadText = "_leadText_i21hl_69";
const contentSection = "_contentSection_i21hl_89";
const styles$2 = {
  container: container$1,
  title: title$1,
  date,
  leadText,
  contentSection
};
function Refund() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: styles$2.container, children: [
    /* @__PURE__ */ jsxs("h1", { className: styles$2.title, children: [
      "Politika e ",
      /* @__PURE__ */ jsx("span", { children: "Rimbursimit" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: styles$2.contentSection, children: [
      /* @__PURE__ */ jsx("p", { className: styles$2.date, children: "Përditësuar së fundmi: Mars 2026" }),
      /* @__PURE__ */ jsxs("p", { className: styles$2.leadText, children: [
        "Mirë se vini në ",
        /* @__PURE__ */ jsx("strong", { children: "GjejNjerin.com" }),
        ". Kjo politikë shpjegon kur dhe si mund të kërkoni rimbursim për abonimin PRO."
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "1. Abonimi PRO" }),
      /* @__PURE__ */ jsx("p", { children: "Abonimi PRO është një shërbim digjital që aktivizohet menjëherë pas pagesës dhe përfshin veçori premium në platformë." }),
      /* @__PURE__ */ jsx("h3", { children: "2. Kur mund të kërkoni rimbursim" }),
      /* @__PURE__ */ jsx("p", { children: "Rimbursimi është i mundur vetëm në këto raste:" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Pagesë e dyfishtë" }),
        /* @__PURE__ */ jsx("li", { children: "Gabim teknik gjatë transaksionit" }),
        /* @__PURE__ */ jsx("li", { children: "Shërbimi PRO nuk u aktivizua nga sistemi" })
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "3. Kur nuk ofrohet rimbursim" }),
      /* @__PURE__ */ jsxs("ul", { children: [
        /* @__PURE__ */ jsx("li", { children: "Ndryshim mendimi pas blerjes" }),
        /* @__PURE__ */ jsx("li", { children: "Mospërdorim i shërbimit PRO" }),
        /* @__PURE__ */ jsx("li", { children: "Përdorim i pjesshëm i abonimit" })
      ] }),
      /* @__PURE__ */ jsx("h3", { children: "4. Abonimet" }),
      /* @__PURE__ */ jsx("p", { children: "Abonimi PRO rinovohet çdo muaj. Ju mund ta anuloni në çdo kohë nga llogaria juaj." }),
      /* @__PURE__ */ jsx("h3", { children: "5. Kontakt" }),
      /* @__PURE__ */ jsx("p", { children: "Për kërkesa rimbursimi na kontaktoni në:" }),
      /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("a", { href: "mailto:info@gjejmjeshtrin.ks", children: "info@gjejmjeshtrin.ks" }) }),
      /* @__PURE__ */ jsx("p", { children: "Kërkesat shqyrtohen brenda 3–7 ditëve pune." }),
      /* @__PURE__ */ jsx("div", { className: styles$2.date, children: "E përditësuar së fundmi: Mars 2026" })
    ] })
  ] });
}
const page = "_page_1gyjz_7";
const container = "_container_1gyjz_27";
const hero = "_hero_1gyjz_143";
const heroContent = "_heroContent_1gyjz_167";
const badge = "_badge_1gyjz_187";
const heroTitle = "_heroTitle_1gyjz_217";
const heroText = "_heroText_1gyjz_249";
const heroActions = "_heroActions_1gyjz_271";
const primaryButton = "_primaryButton_1gyjz_289";
const secondaryButton = "_secondaryButton_1gyjz_343";
const heroNote = "_heroNote_1gyjz_379";
const section = "_section_1gyjz_401";
const sectionHeader = "_sectionHeader_1gyjz_411";
const sectionLabel = "_sectionLabel_1gyjz_423";
const featureGrid = "_featureGrid_1gyjz_477";
const featureCard = "_featureCard_1gyjz_489";
const featureIcon = "_featureIcon_1gyjz_517";
const howSection = "_howSection_1gyjz_577";
const steps = "_steps_1gyjz_589";
const step = "_step_1gyjz_589";
const stepNumber = "_stepNumber_1gyjz_635";
const reasonsGrid = "_reasonsGrid_1gyjz_701";
const reason = "_reason_1gyjz_701";
const check = "_check_1gyjz_745";
const categoriesSection = "_categoriesSection_1gyjz_809";
const categories = "_categories_1gyjz_809";
const category = "_category_1gyjz_835";
const ctaSection = "_ctaSection_1gyjz_881";
const ctaContent = "_ctaContent_1gyjz_889";
const ctaLabel = "_ctaLabel_1gyjz_913";
const ctaButton = "_ctaButton_1gyjz_963";
const footer = "_footer_1gyjz_1021";
const footerLogo = "_footerLogo_1gyjz_1037";
const footerLogoImage = "_footerLogoImage_1gyjz_1047";
const footerLinks = "_footerLinks_1gyjz_1069";
const copyright = "_copyright_1gyjz_1107";
const styles$1 = {
  page,
  container,
  hero,
  heroContent,
  badge,
  heroTitle,
  heroText,
  heroActions,
  primaryButton,
  secondaryButton,
  heroNote,
  section,
  sectionHeader,
  sectionLabel,
  featureGrid,
  featureCard,
  featureIcon,
  howSection,
  steps,
  step,
  stepNumber,
  reasonsGrid,
  reason,
  check,
  categoriesSection,
  categories,
  category,
  ctaSection,
  ctaContent,
  ctaLabel,
  ctaButton,
  footer,
  footerLogo,
  footerLogoImage,
  footerLinks,
  copyright
};
function WhyGjejnjerin() {
  return /* @__PURE__ */ jsxs("main", { className: styles$1.page, children: [
    /* @__PURE__ */ jsx("section", { className: styles$1.hero, children: /* @__PURE__ */ jsxs("div", { className: styles$1.heroContent, children: [
      /* @__PURE__ */ jsx("span", { className: styles$1.badge, children: "🇽🇰 Për profesionistët në Kosovë" }),
      /* @__PURE__ */ jsxs("h1", { className: styles$1.heroTitle, children: [
        "Bëje punën tënde",
        /* @__PURE__ */ jsx("span", { children: " më të lehtë për t'u gjetur." })
      ] }),
      /* @__PURE__ */ jsx("p", { className: styles$1.heroText, children: "Gjejnjerin lidh profesionistët me njerëzit që po kërkojnë shërbimet e tyre." }),
      /* @__PURE__ */ jsxs("div", { className: styles$1.heroActions, children: [
        /* @__PURE__ */ jsxs(Link, { to: "/register", className: styles$1.primaryButton, children: [
          "Regjistrohu falas",
          /* @__PURE__ */ jsx("span", { children: "→" })
        ] }),
        /* @__PURE__ */ jsx("a", { href: "#how-it-works", className: styles$1.secondaryButton, children: "Si funksionon?" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: styles$1.heroNote, children: "✓ Krijo profilin tënd   ✓ Prezanto punën   ✓ Gjej klientë" })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: styles$1.section, children: /* @__PURE__ */ jsxs("div", { className: styles$1.container, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$1.sectionHeader, children: [
        /* @__PURE__ */ jsx("span", { className: styles$1.sectionLabel, children: "GJEJNJERIN" }),
        /* @__PURE__ */ jsx("h2", { children: "Çka është Gjejnjerin?" }),
        /* @__PURE__ */ jsx("p", { children: "Një platformë ku njerëzit mund të gjejnë profesionistët që u nevojiten, ndërsa ti mund të prezantosh shërbimet dhe punën tënde." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$1.featureGrid, children: [
        /* @__PURE__ */ jsxs("article", { className: styles$1.featureCard, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.featureIcon, children: "🔎" }),
          /* @__PURE__ */ jsx("h3", { children: "Gjej klientë" }),
          /* @__PURE__ */ jsx("p", { children: "Bëhu i dukshëm për njerëzit që janë duke kërkuar shërbimet që ti ofron." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: styles$1.featureCard, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.featureIcon, children: "👤" }),
          /* @__PURE__ */ jsx("h3", { children: "Profili yt" }),
          /* @__PURE__ */ jsx("p", { children: "Krijo një profil profesional ku mund të tregosh kush je dhe çfarë pune bën." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: styles$1.featureCard, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.featureIcon, children: "⭐" }),
          /* @__PURE__ */ jsx("h3", { children: "Ndërto besim" }),
          /* @__PURE__ */ jsx("p", { children: "Shfaq punët, eksperiencën dhe vlerësimet e tua për t'u bërë më i besueshëm." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      "section",
      {
        id: "how-it-works",
        className: `${styles$1.section} ${styles$1.howSection}`,
        children: /* @__PURE__ */ jsxs("div", { className: styles$1.container, children: [
          /* @__PURE__ */ jsxs("div", { className: styles$1.sectionHeader, children: [
            /* @__PURE__ */ jsx("span", { className: styles$1.sectionLabel, children: "SI FUNKSIONON" }),
            /* @__PURE__ */ jsx("h2", { children: "Katër hapa. Kaç." }),
            /* @__PURE__ */ jsx("p", { children: "Nga krijimi i profilit deri te kontakti me klientin." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: styles$1.steps, children: [
            /* @__PURE__ */ jsxs("div", { className: styles$1.step, children: [
              /* @__PURE__ */ jsx("div", { className: styles$1.stepNumber, children: "01" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { children: "Krijo profilin" }),
                /* @__PURE__ */ jsx("p", { children: "Regjistrohu falas dhe shto informacionet për veten dhe shërbimet që ofron." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$1.step, children: [
              /* @__PURE__ */ jsx("div", { className: styles$1.stepNumber, children: "02" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { children: "Prezanto punën" }),
                /* @__PURE__ */ jsx("p", { children: "Shto foto, përshkrime, eksperiencën dhe çdo informacion që tregon çfarë di të bësh." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$1.step, children: [
              /* @__PURE__ */ jsx("div", { className: styles$1.stepNumber, children: "03" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { children: "Bëhu i gjetshëm" }),
                /* @__PURE__ */ jsx("p", { children: "Njerëzit që kërkojnë një profesionist mund të gjejnë profilin tënd." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles$1.step, children: [
              /* @__PURE__ */ jsx("div", { className: styles$1.stepNumber, children: "04" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { children: "Kontakto klientët" }),
                /* @__PURE__ */ jsx("p", { children: "Kur një klient është i interesuar, mund të kontaktojë direkt me ty." })
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("section", { className: styles$1.section, children: /* @__PURE__ */ jsxs("div", { className: styles$1.container, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$1.sectionHeader, children: [
        /* @__PURE__ */ jsx("span", { className: styles$1.sectionLabel, children: "PSE TË BASHKOHESH?" }),
        /* @__PURE__ */ jsx("h2", { children: "Puna jote meriton të shihet." }),
        /* @__PURE__ */ jsx("p", { children: "Mos u mbështet vetëm në rekomandime nga një person te tjetri. Krijo vendin tënd online ku klientët mund të të gjejnë." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$1.reasonsGrid, children: [
        /* @__PURE__ */ jsxs("div", { className: styles$1.reason, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.check, children: "✓" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { children: "Prezencë profesionale" }),
            /* @__PURE__ */ jsx("p", { children: "Krijo një profil që tregon qartë çfarë ofron." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$1.reason, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.check, children: "✓" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { children: "Më shumë mundësi" }),
            /* @__PURE__ */ jsx("p", { children: "Bëhu i dukshëm për njerëz që po kërkojnë profesionistë." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$1.reason, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.check, children: "✓" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { children: "Kontakt direkt" }),
            /* @__PURE__ */ jsx("p", { children: "Klientët mund të shohin profilin tënd dhe të lidhen me ty." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: styles$1.reason, children: [
          /* @__PURE__ */ jsx("div", { className: styles$1.check, children: "✓" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { children: "Fillo falas" }),
            /* @__PURE__ */ jsx("p", { children: "Krijo profilin tënd dhe fillo pa pagesë." })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: styles$1.categoriesSection, children: /* @__PURE__ */ jsxs("div", { className: styles$1.container, children: [
      /* @__PURE__ */ jsxs("div", { className: styles$1.sectionHeader, children: [
        /* @__PURE__ */ jsx("span", { className: styles$1.sectionLabel, children: "PËR KË ËSHTË?" }),
        /* @__PURE__ */ jsx("h2", { children: "Nëse ke një aftësi, ka vend për ty." }),
        /* @__PURE__ */ jsx("p", { children: "Nga zanatet tradicionale deri te shërbimet moderne." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: styles$1.categories, children: [
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "⚡ Elektricistë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🔧 Hidraulikë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🧱 Ndërtues" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🎨 Piktorë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🚗 Mekanikë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "💻 IT & Teknologji" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🏠 Pastrues" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "✂️ Berberë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "📸 Fotografë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🔨 Montues" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "🌳 Kopshtarë" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.category, children: "➕ Dhe shumë të tjerë" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: styles$1.ctaSection, children: /* @__PURE__ */ jsxs("div", { className: styles$1.ctaContent, children: [
      /* @__PURE__ */ jsx("span", { className: styles$1.ctaLabel, children: "FILLIMI ËSHTË FALAS" }),
      /* @__PURE__ */ jsx("h2", { children: "Gati që klientët të të gjejnë?" }),
      /* @__PURE__ */ jsx("p", { children: "Krijo profilin tënd në Gjejnjerin dhe fillo të prezantosh shërbimet e tua sot." }),
      /* @__PURE__ */ jsxs(Link, { to: "/register", className: styles$1.ctaButton, children: [
        "Krijo profilin falas",
        /* @__PURE__ */ jsx("span", { children: "→" })
      ] }),
      /* @__PURE__ */ jsx("small", { children: "Regjistrimi zgjat vetëm disa minuta." })
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: styles$1.footer, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: styles$1.footerLogo, children: /* @__PURE__ */ jsx(
        "img",
        {
          src: Logo$1,
          alt: "Gjejnjerin",
          className: styles$1.footerLogoImage
        }
      ) }),
      /* @__PURE__ */ jsx("p", { children: "Gjej njerin që të duhet." }),
      /* @__PURE__ */ jsxs("div", { className: styles$1.footerLinks, children: [
        /* @__PURE__ */ jsx(Link, { href: "/", children: "Ballina" }),
        /* @__PURE__ */ jsx(Link, { href: "/register", children: "Regjistrohu" }),
        /* @__PURE__ */ jsx(Link, { href: "/login", children: "Kyçu" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: styles$1.copyright, children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Gjejnjerin. Të gjitha të drejtat e rezervuara."
      ] })
    ] })
  ] });
}
const loginWrap = "_loginWrap_ker8k_9";
const card = "_card_ker8k_45";
const emailLogoLink = "_emailLogoLink_ker8k_73";
const emailLogo = "_emailLogo_ker8k_73";
const title = "_title_ker8k_115";
const emailDescription = "_emailDescription_ker8k_137";
const emailAddress = "_emailAddress_ker8k_155";
const resetMessage = "_resetMessage_ker8k_193";
const errorMessage = "_errorMessage_ker8k_255";
const form = "_form_ker8k_287";
const inputGroup = "_inputGroup_ker8k_299";
const label = "_label_ker8k_313";
const input = "_input_ker8k_299";
const submitButton = "_submitButton_ker8k_373";
const spinner = "_spinner_ker8k_443";
const registerRow = "_registerRow_ker8k_471";
const textBtn = "_textBtn_ker8k_495";
const styles = {
  loginWrap,
  card,
  emailLogoLink,
  emailLogo,
  title,
  emailDescription,
  emailAddress,
  resetMessage,
  errorMessage,
  form,
  inputGroup,
  label,
  input,
  submitButton,
  spinner,
  registerRow,
  textBtn
};
function Email() {
  const { action } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const currentAction = action === "reset" ? "resetPassword" : action === "confirm" ? "verifyEmail" : mode;
  const isEmailChange = action === "change" || mode === "verifyAndChangeEmail";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [success2, setSuccess] = useState("");
  const [error2, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    async function validateCode() {
      setLoading(true);
      setError("");
      setSuccess("");
      setValidCode(false);
      setEmail("");
      if (!oobCode) {
        setError(
          "Kjo lidhje nuk është e plotë. Ju lutemi hapni lidhjen e plotë nga email-i juaj."
        );
        setLoading(false);
        return;
      }
      try {
        if (currentAction === "resetPassword") {
          const emailAddress2 = await verifyPasswordResetCode(
            auth,
            oobCode
          );
          if (!cancelled) {
            setEmail(emailAddress2);
            setValidCode(true);
          }
        } else if (currentAction === "verifyEmail") {
          const info2 = await checkActionCode(auth, oobCode);
          if (info2.operation !== "VERIFY_EMAIL") {
            throw new Error("Kodi i veprimit të email-it është i papritur.");
          }
          if (!cancelled) {
            setValidCode(true);
          }
        } else if (isEmailChange) {
          const info2 = await checkActionCode(auth, oobCode);
          if (info2.operation !== "VERIFY_AND_CHANGE_EMAIL") {
            throw new Error(
              "Ky kod nuk është për ndryshimin e adresës së email-it."
            );
          }
          if (!cancelled) {
            setEmail(info2.data.email || "");
            setValidCode(true);
          }
        } else {
          if (!cancelled) {
            setError("Ky veprim i email-it nuk mbështetet.");
          }
        }
      } catch (err) {
        console.error("Email action code validation failed:", err);
        if (!cancelled) {
          setError(
            "Kjo lidhje është e pavlefshme, ka skaduar ose është përdorur më parë. Ju lutemi kërkoni një lidhje të re."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    validateCode();
    return () => {
      cancelled = true;
    };
  }, [currentAction, oobCode, isEmailChange]);
  async function handlePasswordReset(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 6) {
      setError("Fjalëkalimi duhet të përmbajë të paktën 6 karaktere.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.");
      return;
    }
    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(
        "Fjalëkalimi juaj u ndryshua me sukses. Tani mund të hyni në llogarinë tuaj me fjalëkalimin e ri."
      );
      setValidCode(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password reset failed:", err);
      if (err.code === "auth/expired-action-code" || err.code === "auth/invalid-action-code") {
        setError(
          "Kjo lidhje për rivendosjen e fjalëkalimit ka skaduar ose është përdorur më parë. Ju lutemi kërkoni një lidhje të re."
        );
      } else if (err.code === "auth/weak-password") {
        setError("Ju lutemi zgjidhni një fjalëkalim më të fortë.");
      } else {
        setError("Nuk arritëm ta ndryshojmë fjalëkalimin. Ju lutemi provoni përsëri.");
      }
    } finally {
      setSubmitting(false);
    }
  }
  async function handleEmailVerification() {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await applyActionCode(auth, oobCode);
      setSuccess(
        "Adresa juaj e email-it u verifikua me sukses. Tani mund të ktheheni në Gjejnjerin."
      );
      setValidCode(false);
    } catch (err) {
      console.error("Email verification failed:", err);
      if (err.code === "auth/expired-action-code" || err.code === "auth/invalid-action-code") {
        setError(
          "Kjo lidhje verifikimi ka skaduar ose është përdorur më parë."
        );
      } else {
        setError("Nuk arritëm ta verifikojmë email-in tuaj. Ju lutemi provoni përsëri.");
      }
    } finally {
      setSubmitting(false);
    }
  }
  async function handleEmailChange() {
    setError("");
    setSuccess("");
    setSubmitting(true);
    let firebaseChangeApplied = false;
    try {
      const info2 = await checkActionCode(auth, oobCode);
      if (info2.operation !== "VERIFY_AND_CHANGE_EMAIL") {
        throw new Error("Ky nuk është një kod i vlefshëm për ndryshimin e email-it.");
      }
      const newEmail = info2.data.email;
      if (!newEmail) {
        throw new Error("Nuk arritëm ta gjejmë adresën e re të email-it.");
      }
      await applyActionCode(auth, oobCode);
      firebaseChangeApplied = true;
      const functions2 = getFunctions(void 0, "us-central1");
      const syncWorkerEmail = httpsCallable(
        functions2,
        "syncWorkerEmailAfterChange"
      );
      try {
        if (!auth.currentUser) {
          throw new Error(
            "Nuk ka sesion aktiv. Për sinkronizimin e profilit duhet të jeni të kyçur."
          );
        }
        await auth.currentUser.reload();
        await auth.currentUser.getIdToken(true);
        await syncWorkerEmail({ email: newEmail });
        setSuccess(
          "Adresa juaj e email-it u ndryshua me sukses. Tani mund të hyni në llogarinë tuaj me email-in e ri."
        );
      } catch (syncError) {
        console.error("Worker email synchronization failed:", syncError);
        setSuccess(
          "Email-i juaj në Firebase u ndryshua me sukses, por profili juaj nuk arriti të sinkronizohej. Ju lutemi kontaktoni mbështetjen nëse të dhënat e llogarisë nuk përditësohen."
        );
      }
      setEmail(newEmail);
      setValidCode(false);
    } catch (err) {
      console.error("Email change failed:", err);
      if (firebaseChangeApplied) {
        setError(
          "Email-i juaj u ndryshua, por një veprim pasues dështoi. Ju lutemi kontaktoni mbështetjen nëse profili juaj ende shfaq email-in e vjetër."
        );
      } else if (err.code === "auth/expired-action-code" || err.code === "auth/invalid-action-code") {
        setError(
          "Kjo lidhje për ndryshimin e email-it ka skaduar ose është përdorur më parë. Ju lutemi kërkoni një lidhje të re."
        );
      } else {
        setError(
          "Nuk arritëm ta ndryshojmë email-in tuaj. Ju lutemi provoni përsëri ose kërkoni një lidhje të re."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }
  const isReset = currentAction === "resetPassword";
  const isVerify = currentAction === "verifyEmail";
  return /* @__PURE__ */ jsx("main", { className: styles.loginWrap, children: /* @__PURE__ */ jsxs("section", { className: styles.card, children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: styles.emailLogoLink, children: /* @__PURE__ */ jsx(
      "img",
      {
        className: styles.emailLogo,
        src: "https://gjejnjerin.com/assets/Logo2-GOoX1SOo.png",
        alt: "Gjejnjerin"
      }
    ) }),
    loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: styles.title, children: "Duke kontrolluar lidhjen..." }),
      /* @__PURE__ */ jsx("p", { className: styles.emailDescription, children: "Ju lutemi prisni derisa të verifikojmë lidhjen tuaj të email-it." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h1", { className: styles.title, children: isReset ? "Rivendos fjalëkalimin" : isEmailChange ? "Konfirmo ndryshimin e email-it" : isVerify ? "Verifiko email-in" : "Veprimi i llogarisë" }),
      /* @__PURE__ */ jsx("p", { className: styles.emailDescription, children: isReset ? "Zgjidhni një fjalëkalim të ri për llogarinë tuaj në Gjejnjerin." : isEmailChange ? "Konfirmoni që dëshironi të ndryshoni email-in e llogarisë suaj në Gjejnjerin në adresën e re më poshtë." : isVerify ? "Konfirmoni adresën tuaj të email-it për të përfunduar verifikimin." : "Ky veprim i email-it nuk mbështetet." }),
      email && (isReset || isEmailChange) && /* @__PURE__ */ jsxs("p", { className: styles.emailAddress, children: [
        isEmailChange ? "Email-i i ri:" : "Llogaria:",
        " ",
        /* @__PURE__ */ jsx("strong", { children: email })
      ] }),
      error2 && /* @__PURE__ */ jsx("div", { className: styles.errorMessage, role: "alert", children: error2 }),
      success2 && /* @__PURE__ */ jsx("div", { className: styles.resetMessage, role: "status", children: success2 }),
      validCode && isReset && !success2 && /* @__PURE__ */ jsxs(
        "form",
        {
          className: styles.form,
          onSubmit: handlePasswordReset,
          children: [
            /* @__PURE__ */ jsxs("div", { className: styles.inputGroup, children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: styles.label,
                  htmlFor: "new-password",
                  children: "Fjalëkalimi i ri"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "new-password",
                  className: styles.input,
                  type: "password",
                  autoComplete: "new-password",
                  placeholder: "Shkruani fjalëkalimin e ri",
                  value: password,
                  onChange: (event) => setPassword(event.target.value),
                  minLength: 6,
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: styles.inputGroup, children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: styles.label,
                  htmlFor: "confirm-password",
                  children: "Konfirmo fjalëkalimin e ri"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "confirm-password",
                  className: styles.input,
                  type: "password",
                  autoComplete: "new-password",
                  placeholder: "Shkruani përsëri fjalëkalimin",
                  value: confirmPassword,
                  onChange: (event) => setConfirmPassword(event.target.value),
                  minLength: 6,
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: styles.submitButton,
                disabled: submitting,
                children: submitting ? /* @__PURE__ */ jsx("span", { className: styles.spinner }) : "Rivendos fjalëkalimin"
              }
            )
          ]
        }
      ),
      validCode && isVerify && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: styles.submitButton,
          onClick: handleEmailVerification,
          disabled: submitting,
          children: submitting ? /* @__PURE__ */ jsx("span", { className: styles.spinner }) : "Verifiko email-in"
        }
      ),
      validCode && isEmailChange && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: styles.submitButton,
          onClick: handleEmailChange,
          disabled: submitting,
          children: submitting ? /* @__PURE__ */ jsx("span", { className: styles.spinner }) : "Konfirmo ndryshimin e email-it"
        }
      ),
      (success2 || error2) && /* @__PURE__ */ jsx("div", { className: styles.registerRow, children: /* @__PURE__ */ jsx(Link, { to: "/login", className: styles.textBtn, children: "Kthehu te kyçja" }) })
    ] })
  ] }) });
}
function AppRoutes({ initialData = null }) {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(MainLayout, {}), children: [
      /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Home, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "workers", element: /* @__PURE__ */ jsx(WorkerList, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "worker/:id",
          element: /* @__PURE__ */ jsx(WorkerProfile, { initialData })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "register", element: /* @__PURE__ */ jsx(WorkerRegister, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "login", element: /* @__PURE__ */ jsx(Login, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "dashboard", element: /* @__PURE__ */ jsx(Dashboard, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "settings", element: /* @__PURE__ */ jsx(ProfileSettings, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "profile", element: /* @__PURE__ */ jsx(UserProfile, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "contact", element: /* @__PURE__ */ jsx(Contact, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "privacy", element: /* @__PURE__ */ jsx(Privacy, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "terms", element: /* @__PURE__ */ jsx(Terms, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "pricing", element: /* @__PURE__ */ jsx(PricingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "help", element: /* @__PURE__ */ jsx(Help, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "refund", element: /* @__PURE__ */ jsx(Refund, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: ":slug",
          element: /* @__PURE__ */ jsx(WorkerProfile, { initialData })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminDashboard, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "enroll", element: /* @__PURE__ */ jsx(AdminEnroll, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "wanted", element: /* @__PURE__ */ jsx(MostWanted, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "bashkohu", element: /* @__PURE__ */ jsx(WhyGjejnjerin, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "email/:action", element: /* @__PURE__ */ jsx(Email, {}) })
    ] }),
    /* @__PURE__ */ jsx(Route, { path: "review/:token", element: /* @__PURE__ */ jsx(ReviewPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(ErrorPage, {}) })
  ] });
}
function AppProviders({ children, helmetContext }) {
  const [queryClient] = useState(() => new QueryClient());
  return /* @__PURE__ */ jsx(HelmetProvider, { context: helmetContext, children: /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx(
      "meta",
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      }
    ) }),
    children
  ] }) });
}
function render(url, initialData) {
  const helmetContext = {};
  const appHtml = renderToString(
    /* @__PURE__ */ jsx(React3.StrictMode, { children: /* @__PURE__ */ jsx(AppProviders, { helmetContext, children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(AppRoutes, { initialData }) }) }) })
  );
  return {
    appHtml,
    helmet: helmetContext.helmet
  };
}
export {
  render
};

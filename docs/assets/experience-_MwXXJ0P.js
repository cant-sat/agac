import{j as t,r as i}from"./index-LxnJo2Kb.js";import{e as f,ae as p,af as j,C as d}from"./index-ba8afaa4.esm-Bcd7HwcT.js";import{C as S}from"./CameraShake-DlbNHD8t.js";function c(e,r){return Math.random()*(r-e)+e}function g(){return c(-1,1)<0?-1:1}function w(e,r,a=!1,n=new f(0,0,0)){const s=c(-r,r),h=Math.sqrt(r*r-s*s);let o=c(-h,h);a&&(o=Math.abs(o));const m=e*e-s*s-o*o<0?0:e*e-s*s-o*o,u=Math.sqrt(m),l=Math.sqrt(r*r-s*s-o*o),x=g()*c(u,l);return new f(n.x+s,n.y+o,n.z+x)}function y(e,r=.5,a=.5){return t.jsx(t.Fragment,{children:t.jsxs("mesh",{position:e,children:[t.jsx("sphereGeometry",{args:[c(r,a),32,32]}),t.jsx("meshBasicMaterial",{})]})})}function M(){return t.jsx(t.Fragment,{children:Array.from({length:300},()=>y(w(50,70,!0),.2,.3))})}let z;const C=t.jsx(M,{});function G(){const[e,r]=i.useState(0);z=r;const{camera:a}=p();a.position.set(0,0,(e+600)/200),i.useEffect(()=>{a.position.set(0,0,(e+600)/200)},[a,e]);const n=i.useRef(null);return j(()=>{n.current&&(n.current.rotation.x+=.01*((e+500)/1e3),n.current.rotation.y+=.01*((e+500)/1e3))}),t.jsxs(t.Fragment,{children:[t.jsx("pointLight",{color:new d("#ff00ff"),position:[1,.5,0],intensity:1,castShadow:!0,"shadow-mapSize-width":1024,"shadow-mapSize-height":1024,"shadow-camera-near":.1,"shadow-camera-far":25}),t.jsx(S,{intensity:.8}),t.jsxs("mesh",{ref:n,position:[1,.5,0],castShadow:!0,children:[t.jsx("torusGeometry",{args:[1,.2,3,20,20]}),t.jsx("meshStandardMaterial",{})]}),t.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-1,0],receiveShadow:!0,children:[t.jsx("planeGeometry",{args:[1e3,1e3]}),t.jsx("meshStandardMaterial",{})]}),C]})}export{G as default,z as setScroll};
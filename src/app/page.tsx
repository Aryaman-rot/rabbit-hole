import { Landing } from "@/components/landing";

const bootScript = `(function(){try{var d=document.documentElement;if(!window.matchMedia||matchMedia("(prefers-reduced-motion: reduce)").matches)return;var m=window.CSS&&CSS.supports&&(CSS.supports("mask-image","linear-gradient(#000,#000)")||CSS.supports("-webkit-mask-image","linear-gradient(#000,#000)"));d.classList.add(m?"rh-anim":"rh-anim-fade");if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){d.classList.add("rh-begin")},function(){d.classList.add("rh-begin")})}else{d.classList.add("rh-begin")}}catch(e){}})()`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <Landing />
    </>
  );
}

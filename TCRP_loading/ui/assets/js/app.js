let menutoggle = false;
let githubraw;
let video = false;
let videofile;

window.addEventListener('DOMContentLoaded', () => {
   if (window.nuiHandoverData.umloginscreen == "steam") {
      let getJson = JSON.parse(window.nuiHandoverData.json).response.players[0];
      $("div.profile small").html(getJson.personaname);
      $("div.profile img").attr("src", getJson.avatarfull);
   }
});

if (UM.YoutubeVideo.enabled) {
   $(".youtube-background").html(`<div data-vbg="https://www.youtube.com/watch?v=${UM.YoutubeVideo.videoId}"></div>`)
   $('[data-vbg]').youtube_background();
} else if (UM.DefaultVideo.enabled) {
   $(".default-video").html(`
<video autoplay muted loop id="myVideo">
         <source src="assets/video/${UM.DefaultVideo.lightId}.mp4" type="video/mp4">
       </video>"></div>
`)
   $(".dark").click(function() {
      if (video) {
         videofile = `assets/video/${UM.DefaultVideo.lightId}.mp4`
         video = false
         $(".dark i").css("color", "var(--white)");
         $(':root').css('--darklight', '#ffffff17');
      } else {
         videofile = `assets/video/${UM.DefaultVideo.darkId}.mp4`
         video = true
         $(".dark i").css("color", "var(--green)");
         $(':root').css('--darklight', '#1a1a1ab8');
      }
      $("video source").attr("src", videofile);
      $("video").fadeIn('slow');
      $("video")[0].load();
      $("video")[0].play();
   });
} else if (UM.RandomBackground.enabled) {
   RandomBackground()
   setInterval(RandomBackground, 4000);
} else {
   $(".content").css("background-image", `url('assets/img/bg/${UM.RandomBackground.img[0]}')`);
}

if (UMLang.Menu.enabled) {
   MenuBoxLang("new", UMLang.Menu.menu1, UMLang.Menu.menu1alt);
   MenuBoxLang("about", UMLang.Menu.menu2, UMLang.Menu.menu2alt);
   MenuBoxLang("effects", UMLang.Menu.menu3, UMLang.Menu.menu3alt)
}

if (UM.RandomInfo.enabled) {
   RandomText()
   setInterval(RandomText, 3000);
}

if (UM.RandomColor.enabled) { 
   setInterval(RGBColor, UM.RandomColor.time);
}
$("#langsc").attr("src", `../lang/${UM.Lang}.js`);
$("div.logo img").attr("src", `assets/img/${UM.Logo}`);
$("#music").attr("src", `assets/audio/${UM.Music.musicID}`);
$(':root').css('--green', UM.TemplateColor.defaultcolor)
$(':root').css('--opacity', UM.TemplateColor.opacitycolor)
$("a.store").html(`<i class="fas fa-store"></i> ${UMLang.Nav.nav1}`)
$("a.about").html(`<i class="fas fa-cat"></i> ${UMLang.Nav.nav2}`)
$("a.discord").html(`<i class="fab fa-discord"></i> ${UMLang.Nav.nav3}`)
$("span.button__text").html(`${UMLang.Loading}`)
$('.nav ul a.store').attr('href', UM.NavUrl.store);
$('.nav ul a.discord').attr('href', UM.NavUrl.discord);
$.get(`https://raw.githubusercontent.com/${UM.GithubUserName}/um-loadingscreen/main/newupdates`, function(data) {
   githubraw = data;
})

$("div.effects").click(function() {
   $("#snow").toggle();
});

$(".fa-gamepad").click(function() {
   $("#area").toggle();
});

$("div.new").click(function() {
	MenuContent("pizza-slice", `${UMLang.Menu.menu1} ${UMLang.Menu.menu1alt}`, githubraw);
 });
 $("div.about").click(function() {
	MenuContent("cat", `${UMLang.Menu.menu2} ${UMLang.Menu.menu2alt}`, UM.About);
 });

function RandomText() {
   let random = Math.floor(UM.RandomInfo.text.length * Math.random())
   $(".info p").html(UM.RandomInfo.text[random]);
}

function MenuContent(icon, title, content) {
   $(".menu-content h3").html(`<i class="fas fa-${icon}"></i> ${title}`);
   $(".menu-content p").html(content);
   if (!menutoggle) {
      $(".menu-content").fadeIn("slow");
      menutoggle = true;
   } else {
      $(".menu-content").fadeOut("slow");
      menutoggle = false;
   }
}

function RandomBackground() {
   let images = UM.RandomBackground.img
   let randomImage = Math.floor((Math.random() * images.length));
   $(".content").css("transition", "background-image 2s");
   $(".content").css("background-image", "url('assets/img/bg/" + images[randomImage] + "')");
}

function MenuBoxLang(divname, title, childtitle) {
   $(`.${divname} div.menu-item-text h3`).html(title);
   $(`.${divname} div.menu-item-text p`).html(childtitle);
}

function RGBColor() {   
   let color1=Math.floor(Math.random() * 255) + 1;
   let color2=Math.floor(Math.random() * 255) + 1;
   let color3=Math.floor(Math.random() * 255) + 1;
   $(':root').css('--green', 'rgb('+ color1 + ',' +  color2 +',' + color3 +')');
 }


 let music = document.getElementById("music");    
 music.volume = UM.Music.volume;
 music.play();
 let play = false
 $("#musicicon").click(function(){
     if (! play) {
         $("#musicicon").attr("class","fas fa-volume-mute");
         music.pause();
         play = true;
     } else {
         $("#musicicon").attr("class","fas fa-volume-up");
         music.play();
         play = false;
     }
 });


let count = 0;
let thisCount = 0;

const handlers = {
   startInitFunctionOrder(data) {
      count = data.count;
   },

   initFunctionInvoking(data) {
      document.querySelector(".button__progress").style.left = "0%";
      document.querySelector(".button__progress").style.width = (data.idx / count) * 100 + "%";
   },

   startDataFileEntries(data) {
      count = data.count;
   },

   performMapLoadFunction(data) {
      ++thisCount;

      document.querySelector(".button__progress").style.left = "0%";
      document.querySelector(".button__progress").style.width = (thisCount / count) * 100 + "%";
   },
};

window.addEventListener("message", function(e) {
   (handlers[e.data.eventName] || function() {})(e.data);
});
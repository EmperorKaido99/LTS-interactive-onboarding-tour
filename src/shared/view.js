/**
 * View/perspective switcher — Normal, ACCA, SAIT, SAIGA.
 *
 * The view is chosen in the dropdown on the Select Training Module screen
 * and stored in localStorage (a ?view= query parameter also works).
 * It swaps the partner logo in the banner header, the firm/user names in
 * the firm bar, and the User Details training-programme fields.
 */
(function () {
  var VIEWS = {
    normal: {
      firm: "Firm: LTS Training Demo Firm",
      user: "Trainee A-LTS (Trainee)",
      heroTitle: "Welcome to the LTS Learner Tracking System.",
      heroText:
        "“LTS helps trainees and their firms track training records, skills reviews, " +
        "and sign-offs in one place.”",
      heroAttribution: "",
      details: {
        surname: "A-Mostert",
        firstName: "Susan",
        dob: "2000/02/08",
        staffNumber: "",
        email1: "Susan@LTSystems.co.zaa",
        membershipLabel: "Membership Number:",
        membershipValue: "",
        electiveLabel: "Elective:",
        electiveValue: "LTS Objectives 2023",
        contractStart: "2024/01/01",
        contractEnd: "2026/12/31",
        trainingBStart: "2025/01/01",
        trainingCStart: "2026/01/01",
        trainingPeriod: "A",
      },
    },
    acca: {
      firm: "Firm: LTS ACCA Training Demo Firm",
      user: "Trainee A-LTS (Trainee)",
      logo:
        '<span class="acca-logo-think">Think Ahead</span>' +
        '<span class="acca-logo-box">ACCA</span>',
      partnerKey: "acca",
      heroTitle: "LTS now also in collaboration with ACCA.",
      heroText:
        "“We are excited to announce that LTS has worked with ACCA to develop a digital solution " +
        "to support ACCA members and future members in South Africa. This platform meets our " +
        "rigorous standards and will greatly benefit those pursuing both ACCA membership and " +
        "ACCA's South Africa Audit Qualification. Together, we are dedicated to providing " +
        "valuable support for their journey to success.”",
      heroAttribution: "Stefan Pegram, ACCA Director of Practice Regulation",
    },
    sait: {
      firm: "Firm: LTS - SAIT Demo Pty Ltd",
      user: "Susan Kekana (Trainee)",
      logo:
        '<span class="sait-logo-word">s<span class="gold">a</span>it</span>' +
        '<span class="sait-logo-text"><span class="gold">South African</span><br>Institute of<br>Taxation</span>',
      partnerKey: "sait",
      heroTitle: "LTS now also in collaboration with SAIT.",
      heroText:
        "“We are proud to work with LTS to give SAIT trainees a modern, reliable way to track " +
        "their tax professional training records — from registration through to sign-off.”",
      heroAttribution: "SAIT Learnership Support Team",
      details: {
        surname: "Kekana",
        firstName: "Susan",
        dob: "2003/11/04",
        staffNumber: "123456",
        email1: "Susan@LTSystems.co.za",
        membershipLabel: "SAIT Tax Trainee Number:",
        membershipValue: "52468248",
        electiveLabel: "Programme:",
        electiveValue: "Tax Professional (Transfer Pricing)",
        contractStart: "2021/01/01",
        contractEnd: "2023/12/31",
        trainingBStart: "2022/01/01",
        trainingCStart: "2023/01/01",
        trainingPeriod: "C",
        hideMapped: true,
      },
    },
    saiga: {
      firm: "Firm: LTS SAIGA Demo Firm",
      user: "Demo-EA A-Trainee (Trainee)",
      logo:
        '<span class="saiga-logo-word">SAIGA</span>' +
        '<span class="saiga-logo-divider"></span>' +
        '<span class="saiga-logo-text"><span class="adv">Advancing</span>' +
        '<span class="rest">Auditing &amp; Accountability</span></span>',
      partnerKey: "saiga",
      heroTitle: "LTS now also in collaboration with SAIGA.",
      heroText:
        "“LTS gives SAIGA trainee accountants a clear, structured way to record their training " +
        "hours and competencies throughout their SAIGA programme.”",
      heroAttribution: "SAIGA Training Support Team",
      details: {
        surname: "A-Trainee",
        firstName: "Demo-EA",
        dob: "1993/02/08",
        staffNumber: "",
        email1: "Susan@ltsystems.co.za",
        membershipLabel: "SAIGA Membership Number:",
        membershipValue: "258963",
        electiveLabel: "Elective:",
        electiveValue: "2024RGA_EA",
        contractStart: "2024/10/01",
        contractEnd: "2027/09/30",
        trainingBStart: "2025/10/01",
        trainingCStart: "2026/10/01",
        trainingPeriod: "B",
        hideMapped: true,
        showSeta: true,
      },
    },
  };

  function normalize(name) {
    // "standard" was the old name for the ACCA view
    if (name === "standard") return "acca";
    return name;
  }

  function getView() {
    try {
      var q = normalize(new URLSearchParams(window.location.search).get("view"));
      if (q && VIEWS[q]) {
        localStorage.setItem("lts-view", q);
        return q;
      }
      var stored = normalize(localStorage.getItem("lts-view"));
      return VIEWS[stored] ? stored : "acca";
    } catch (e) {
      return "acca";
    }
  }

  function setValue(id, value) {
    var el = document.getElementById(id);
    if (el) el.value = value;
  }

  function setLabel(forId, text) {
    var el = document.querySelector('label[for="' + forId + '"]');
    if (el) el.textContent = text;
  }

  function apply() {
    var cfg = VIEWS[getView()];

    // Partner logo in the banner header (internal screens) or the public
    // site header (login page) — ACCA / SAIT / SAIGA only, Normal shows none
    var header = document.querySelector(".lts-internal-header") || document.querySelector(".lts-header-right");
    if (header && cfg.logo && !header.querySelector(".header-partner")) {
      var box = document.createElement("div");
      box.className = "header-partner";
      box.innerHTML = cfg.logo;
      header.appendChild(box);
    }

    // Login page hero copy + partner bar (login.html only)
    var heroTitle = document.querySelector(".login-hero-left h2");
    if (heroTitle && cfg.heroTitle) heroTitle.textContent = cfg.heroTitle;
    var heroText = document.querySelector(".login-hero-left p");
    if (heroText && cfg.heroText) heroText.innerHTML = cfg.heroText;
    var heroAttribution = document.querySelector(".hero-attribution");
    if (heroAttribution) {
      if (cfg.heroAttribution) {
        heroAttribution.textContent = cfg.heroAttribution;
        heroAttribution.style.display = "";
      } else {
        heroAttribution.style.display = "none";
      }
    }
    var partnerItems = document.querySelectorAll(".partner-bar .acca, .partner-bar .sait, .partner-bar .saiga");
    if (partnerItems.length) {
      partnerItems.forEach(function (el) {
        var isActive = cfg.partnerKey && el.classList.contains(cfg.partnerKey);
        el.style.opacity = isActive ? "1" : "0.35";
      });
    }

    // Firm bar
    var firmName = document.querySelector(".lts-firm-bar .firm-name");
    if (firmName) firmName.textContent = cfg.firm;
    var userInfo = document.querySelector(".lts-firm-bar .user-info");
    if (userInfo) {
      userInfo.innerHTML = cfg.user + ' | <a href="login.html">LOG OUT</a>';
    }

    // User Details field variations
    var d = cfg.details;
    if (!d || !document.getElementById("acca-number")) return;

    setValue("surname", d.surname);
    setValue("first-name", d.firstName);
    setValue("dob", d.dob);
    setValue("staff-number", d.staffNumber);
    setValue("email1", d.email1);

    setLabel("acca-number", d.membershipLabel);
    setValue("acca-number", d.membershipValue);
    setLabel("elective", d.electiveLabel);
    setValue("elective", d.electiveValue);

    setValue("contract-start", d.contractStart);
    setValue("contract-end", d.contractEnd);
    setValue("training-b-start", d.trainingBStart);
    setValue("training-c-start", d.trainingCStart);
    setValue("training-period", d.trainingPeriod);

    // Mapped Group only exists on the Normal and ACCA views
    var mappedGroup = document.getElementById("mapped-group");
    if (mappedGroup && d.hideMapped && mappedGroup.closest(".form-row")) {
      mappedGroup.closest(".form-row").style.display = "none";
    }

    // SETA row only exists on the SAIGA view
    var setaRow = document.getElementById("seta-row");
    if (setaRow && d.showSeta) setaRow.style.display = "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();

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
    },
    sait: {
      firm: "Firm: LTS - SAIT Demo Pty Ltd",
      user: "Susan Kekana (Trainee)",
      logo:
        '<span class="sait-logo-word">s<span class="gold">a</span>it</span>' +
        '<span class="sait-logo-text"><span class="gold">South African</span><br>Institute of<br>Taxation</span>',
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

    // Partner logo in the banner header (ACCA / SAIT / SAIGA)
    var header = document.querySelector(".lts-internal-header");
    if (header && cfg.logo && !header.querySelector(".header-partner")) {
      var box = document.createElement("div");
      box.className = "header-partner";
      box.innerHTML = cfg.logo;
      header.appendChild(box);
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

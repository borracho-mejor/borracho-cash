import * as Element from "./element.js";
import * as Util from "./util.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";

export function addEventListeners() {
  Element.footerDonations.addEventListener("click", async () => {
    await donations_info();
    $("#modal-donations").on("hidden.bs.modal", function (e) {
      $("#loadingoverlay").modal("hide");
    });
  });
}

export async function donations_info() {
  Util.popUpLoading("Loading spending...", "");

  let donationsText = "";

  donationsText += `<h5>
                        Donations are always accepted and appreciated. However, my plan
                        is to keep the website up and running as long as it is possible
                        and feasible. Currently, any donations will sit in their
                        respective wallet until they are needed for site or developments
                        costs.
                    </h5>
                    <div class="dark-mode" style="text-align: center;">
                          <qr-code
                            class="inline donation-qr"
                            style="max-width:49%;"
                            contents=${Constant.BCHDonationAddress}
                            module-color="rgba(245, 248, 250, 0.87)"
                            position-ring-color="rgba(245, 248, 250, 0.87)"
                            position-center-color="rgba(245, 248, 250, 0.87)"
                            "
                          >
                            <img src="./images/bitcoin-cash-circle.svg" slot="icon" />
                          </qr-code>
                          <qr-code
                            class="inline donation-qr"
                            style="max-width:49%;"
                            contents=${Constant.smartBCHDonationAddress}
                            module-color="rgba(245, 248, 250, 0.87)"
                            position-ring-color="rgba(245, 248, 250, 0.87)"
                            position-center-color="rgba(245, 248, 250, 0.87)"
                            "
                          >
                            <img src="./images/smartBCH-LOGO-no-text.svg" slot="icon" />
                          </qr-code>
                    </div>
                    <div class="light-mode" style="text-align: center">
                          <qr-code
                            class="inline donation-qr"
                            style="max-width:49%;"
                            contents=${Constant.BCHDonationAddress}
                            module-color="rgba(0, 0, 0, 0.87)"
                            position-ring-color="rgba(0, 0, 0, 0.87)"
                            position-center-color="rgba(0, 0, 0, 0.87)"
                            "
                          >
                            <img src="./images/bitcoin-cash-circle.svg" slot="icon" />
                          </qr-code>
                          <qr-code
                            class="inline donation-qr"
                            style="max-width:49%;"
                            contents=${Constant.smartBCHDonationAddress}
                            module-color="rgba(0, 0, 0, 0.87)"
                            position-ring-color="rgba(0, 0, 0, 0.87)"
                            position-center-color="rgba(0, 0, 0, 0.87)"
                            "
                          >
                            <img src="./images/smartBCH-LOGO-no-text.svg" slot="icon" />
                          </qr-code>
                    </div>
                    <p style="word-wrap: break-word; font-size: 0.85rem;">
                        <b>mainchain</b>: ${Constant.BCHDonationAddress}<br />
                        <b>smartBCH</b>: ${Constant.smartBCHDonationAddress}
                    </p>`;

  let spending = "";
  let totalBCHSpending = 0.0;
  let totalUSDSpending = 0.0;
  donationsText += `<h5>Spending</h5>`;
  try {
    spending = await FirebaseController.getSpendingList();
  } catch (error) {
    Util.popUpInfo("Error in getSpendingList", JSON.stringify(error));
    return;
  }
  if (spending != "") {
    // show spending
    let index = 0;
    donationsText += `<table style="width: 100%">
                        <tr>
                         <th>Expenditure</th>
                         <th>BCH Amount</th>
                         <th>USD Amount</th>
                        </tr>`;
    spending.forEach(async (spending) => {
      donationsText += buildDonationsRow(spending, index);
      ++index;
      totalBCHSpending += spending.bchAmount;
      totalUSDSpending += spending.usdAmount;
    });
    donationsText += `<tr>
                        <th>Total Spending</th>
                        <th>${totalBCHSpending.toFixed(8)} &#x20BF;</th>
                        <th>$ ${totalUSDSpending.toFixed(2)}</th>
                      </tr>
                    </table><div style="height: 1rem"></div>`;
  } else {
    // show none
    donationsText += `<p>No spending found!</p>`;
  }
  let donations = "";
  let totalBCHDonations = 0.0;
  let totalUSDDonations = 0.0;
  donationsText += `<h5>Donations</h5>`;
  try {
    donations = await FirebaseController.getDonationsList();
  } catch (error) {
    Util.popUpInfo("Error in getDonationsList", JSON.stringify(error));
    return;
  }

  if (donations != "") {
    // show donations
    let index = 0;
    donationsText += `<table style="width: 100%">
                         <tr>
                            <th>Donation</th>
                            <th>BCH Amount</th>
                            <th>USD Amount</th>
                         </tr>`;
    await donations.forEach(async (donation) => {
      donationsText += buildDonationsRow(donation, index);
      ++index;
      totalBCHDonations += donation.bchAmount;
      totalUSDDonations += donation.usdAmount;
    });
    donationsText += `<tr>
                        <th>Total Donations</th>
                        <th>${totalBCHDonations.toFixed(8)} &#x20BF;</th>
                        <th>$ ${totalUSDDonations.toFixed(2)}</th>
                      </tr>
                    </table><div style="height: 1rem"></div>`;
  } else {
    // show none
    donationsText += `<p>No donations found!</p>`;
  }

  donationsText += `<h5>Cost Delta</h5>`;
  if (spending != "" || donations != "") {
    // show delta
    let bchDelta = totalBCHDonations - totalBCHSpending;
    let usdDelta = totalUSDDonations - totalUSDSpending;
    donationsText += `<table style="width: 100%">
                        <tr>
                            <th>BCH Amount</th>
                            <th>USD Amount</th>
                        </tr>`;
    if (bchDelta < 0.0) {
      donationsText += `<tr>
                            <td><span style="color: #dc3545;">${bchDelta.toFixed(
                              8
                            )} &#x20BF;</span></th>`;
    } else {
      donationsText += `<tr>
                            <td>${bchDelta.toFixed(8)} &#x20BF;</th>`;
    }
    if (usdDelta < 0.0) {
      donationsText += `<td><span style="color: #dc3545;">$ ${usdDelta.toFixed(
        2
      )}</span></th>
                          </tr>
                        </table>`;
    } else {
      donationsText += `<td>$${usdDelta.toFixed(2)}</th>
                          </tr>
                        </table>`;
    }
  } else {
    // show none
    donationsText += `<p>No Delta to calculate.</p>`;
  }

  Element.donationsBody.innerHTML = donationsText;

  const qrs = document.getElementsByClassName("donation-qr");
  for (const qr of qrs) {
    qr.addEventListener("click", () => {
      qr.animateQRCode("RadialRipple");
    });
  }

  // setTimeout(function () {
  //   $("#loadingoverlay").modal("hide");
  // }, 500);
}

function buildDonationsRow(item, index) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-incognito" viewBox="0 0 16 16"><path fill-rule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205a1.032 1.032 0 0 0-.014-.058l-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5c-.62 0-1.411-.136-2.025-.267-.541-.115-1.093.2-1.239.735Zm.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a29.58 29.58 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274ZM3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Zm-1.5.5c0-.175.03-.344.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085c.055.156.085.325.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0v-1Zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Z"/></svg>`;
  const svgSeries = svg + " " + svg + " " + svg + " " + svg + " " + svg;
  return `<tr>
            <td>${item.title == "anon" ? svgSeries : item.title}</td>
            <td>${item.bchAmount.toFixed(8)} &#x20BF;</td>
            <td>$ ${item.usdAmount.toFixed(2)}</td>
          </tr>`;
}

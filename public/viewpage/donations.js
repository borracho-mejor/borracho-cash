import * as Element from "./element.js";
import * as Util from "./util.js";
import * as FirebaseController from "../controller/firebase_controller.js";

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
                    <div style="text-align: center">
                        <img
                            class="inline"
                            src="./images/bch_donations_qr.png"
                            alt="bch_qr"
                            style="max-width: 40%; margin: 1em"
                        />
                        <img
                            class="inline"
                            src="./images/smartBCH_donations_qr.png"
                            alt="sbch_qr"
                            style="max-width: 40%; margin: 1em"
                        />
                    </div>
                    <p style="word-wrap: break-word;">
                        bitcoincash:qqlw4yggvgfc24pv8vzpv4svx35rtf3txvdeahpzml<br />
                        smartbch:0x7256a81B2c936B00c5b19415722a65E77d52a468
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

  // setTimeout(function () {
  //   $("#loadingoverlay").modal("hide");
  // }, 500);
}

function buildDonationsRow(item, index) {
  return `<tr>
            <td>${item.title}</td>
            <td>${item.bchAmount.toFixed(8)} &#x20BF;</td>
            <td>$ ${item.usdAmount.toFixed(2)}</td>
          </tr>`;
}

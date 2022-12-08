import * as Element from "../viewpage/element.js";
import * as FirebaseController from "./firebase_controller.js";

export async function makeBCHNavbarBox() {
  const bchData = await FirebaseController.getBCHPrice();

  let twentyFourHourTag = "";
  if (bchData.twentyFourHourChange < 0) {
    twentyFourHourTag += `<span class="badge badge-danger">${bchData.twentyFourHourChange.toFixed(
      1
    )}%</span>`;
  } else {
    twentyFourHourTag += `<span class="badge badge-success">+${bchData.twentyFourHourChange.toFixed(
      1
    )}%</span>`;
  }

  let sevenDayTag = "";
  if (bchData.sevenDayChange < 0) {
    sevenDayTag += `<span class="badge badge-danger">${bchData.sevenDayChange.toFixed(
      1
    )}%</span>`;
  } else {
    sevenDayTag += `<span class="badge badge-success">+${bchData.sevenDayChange.toFixed(
      1
    )}%</span>`;
  }

  let thirtyDayTag = "";
  if (bchData.thirtyDayChange < 0) {
    thirtyDayTag += `<span class="badge badge-danger">${bchData.thirtyDayChange.toFixed(
      1
    )}%</span>`;
  } else {
    thirtyDayTag += `<span class="badge badge-success">+${bchData.thirtyDayChange.toFixed(
      1
    )}%</span>`;
  }

  let btcTag = "";
  if (bchData.changeInBTCPrice24h < 0) {
    btcTag += `<span class="badge badge-danger">${bchData.priceInBTC.toFixed(
      6
    )}</span>`;
  } else {
    btcTag += `<span class="badge badge-success">+${bchData.priceInBTC.toFixed(
      6
    )}</span>`;
  }

  let html = `<a href="https://www.coingecko.com/coins/bitcoin-cash" target="_blank_" class="bch-box"><table class="nav-box-item" style="width: 100%; text-align: center; border: none; border-collapse: collapse;">
                  <tbody style="padding: 0; margin: 0; border: none;">
                    <tr style="padding: 0; margin: 0; border: none;">
                      <th  style="padding: 0; margin: 0; border: none;"colspan="1000">Bitcoin Cash</th>
                    </tr>
                    <tr style="padding: 0; margin: 0; border: none;">
                      <td style="padding: 0 0.5rem; margin: 0; border: none; font-size:75%; background-color: #038047;">${
                        bchData.marketcapRank
                      }</td>
                      <td style="padding: 0 0.5rem; margin: 0; border: none; font-size:75%; background-color: #038047;">$${bchData.price.toFixed(
                        2
                      )}</td>
                      <td style="padding: 0 0.25rem; margin: 0; border: none; font-size:85%; background-color: #026035;">${twentyFourHourTag}</td>
                      <td style="padding: 0 0.25rem; margin: 0; border: none; font-size:85%; background-color: #026035;">${sevenDayTag}</td>
                      <td style="padding: 0 0.25rem; margin: 0; border: none; font-size:85%; background-color: #026035;">${thirtyDayTag}</td>
                      <td style="padding: 0 0.5rem; margin: 0; border: none; font-size:85%; background-color: #038047;">${btcTag}</td>
                    </tr>
                    <tr style="padding: 0; margin: 0; border: none; font-size:65%;">
                      <td style="padding: 0; margin: 0; border: none; background-color: #038047;">Rank</td>
                      <td style="padding: 0; margin: 0; border: none; background-color: #038047;">Price</td>
                      <td style="padding: 0; margin: 0; border: none; background-color: #026035;">24h</td>
                      <td style="padding: 0; margin: 0; border: none; background-color: #026035;">7d</td>
                      <td style="padding: 0; margin: 0; border: none; background-color: #026035;">30d</td>
                      <td style="padding: 0; margin: 0; border: none; background-color: #038047;">BTC/BCH</td>
                    </tr>
                  </tbody>
              </table></a>
             `;

  Element.bchInfoBox.innerHTML = html;

  return bchData.price;
}

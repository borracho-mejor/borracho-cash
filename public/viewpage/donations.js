import * as Element from "./element.js";

export function addEventListeners() {
  Element.donationsBody.innerHTML = donationsText;
}

const donationsText = `<h5>
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
                        <p>
                            bitcoincash:qqlw4yggvgfc24pv8vzpv4svx35rtf3txvdeahpzml<br />
                            smartbch:0x7256a81B2c936B00c5b19415722a65E77d52a468
                        </p>
                        <h5>Spending</h5>
                        <table style="width: 100%">
                            <tr>
                                <th>Expenditure</th>
                                <th>BCH Amount</th>
                                <th>USD Amount</th>
                            </tr>
                            <tr>
                                <td>1 yr Domain</td>
                                <td>0.03384805 &#x20BF;</td>
                                <td>$12.16</td>
                            </tr>
                            <tr>
                                <td>1 yr Hosting (Unused)</td>
                                <td>0.04871224 &#x20BF;</td>
                                <td>$17.50</td>
                            </tr>
                            <tr>
                                <td>1 yr SSL</td>
                                <td>0.01976325 &#x20BF;</td>
                                <td>$7.10</td>
                            </tr>
                            <tr>
                                <td>1 yr Domain (Unused)</td>
                                <td>0.01976325 &#x20BF;</td>
                                <td>$9.16</td>
                            </tr>
                            <tr>
                                <th>Total:</th>
                                <th>0.12208679 &#x20BF;</th>
                                <th>$45.92</th>
                            </tr>
                        </table>
                        <div style="height: 1rem"></div>
                        <h5>Donations/Income</h5>
                        <table style="width: 100%">
                            <tr>
                                <th>Donation</th>
                                <th>BCH Amount</th>
                                <th>USD Amount</th>
                            </tr>
                            <tr>
                                <td>Kasumi LNS Test (BCH)</td>
                                <td>0.01000000 &#x20BF;</td>
                                <td>$2.69</td>
                            </tr>
                            <tr>
                                <td>Self LNS Test (BCH)</td>
                                <td>0.01000000 &#x20BF;</td>
                                <td>$2.69</td>
                            </tr>
                            <tr>
                                <td>Read.cash Article</td>
                                <td>0.00388501 &#x20BF;</td>
                                <td>$0.90</td>
                            </tr>
                            <tr>
                                <td>Read.cash Article</td>
                                <td>0.00023856 &#x20BF;</td>
                                <td>$0.05</td>
                            </tr>
                            <tr>
                                <td>Read.cash Article</td>
                                <td>0.00504089 &#x20BF;</td>
                                <td>$0.92</td>
                            </tr>
                            <tr>
                                <th>Total:</th>
                                <th>0.02916446 &#x20BF;</th>
                                <th>$7.25</th>
                            </tr>
                        </table>
                        <div style="height: 1rem"></div>
                        <h5>Cost Delta</h5>
                        <table style="width: 100%">
                            <tr>
                                <th>BCH Amount</th>
                                <th>USD Amount</th>
                            </tr>
                            <tr>
                                <td>0.09292233 &#x20BF;</th>
                                <td>$38.67</th>
                            </tr>
                        </table>`;

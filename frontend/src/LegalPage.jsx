import React from "react";

export default function LegalPage() {
  return (
    <div
      className="text-[#EAECEF] min-h-screen px-6 md:px-20 py-16"
      style={{
        background:
          "radial-gradient(circle at top, rgba(120, 200, 255, 0.25), transparent 45%), " +
          "radial-gradient(circle at top right, rgba(0, 180, 255, 0.18), transparent 55%), " +
          "radial-gradient(circle at bottom left, rgba(0, 120, 200, 0.20), transparent 60%), " +
          "linear-gradient(180deg, #0a1a2a 0%, #06121f 60%, #040b14 100%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >

      {/* HEADER */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-semibold text-white">
          Licenses, Registrations & Legal Matters
        </h1>
        <p className="text-gray-400 mt-3 text-sm max-w-3xl mx-auto">
          SwanCore operates under a global regulatory framework with licensed entities across multiple jurisdictions.
        </p>
      </div>

      {/* CONTENT BLOCKS */}
      <div className="space-y-10">

        {/* GLOBAL */}
        <Section title="Global - ADM (Abu Dhabi)">
          Abu Dhabi  Markets (ADM) SwanCore’s global platform, SwanCore.com, is now regulated by the ADGM Financial Services Regulatory Authority (FSRA) via three separate licensed entities: • Nest Exchange Limited is recognised as a Recognised Investment Exchange (Derivatives), with a stipulation for Operating a Multilateral Trading Facility for Virtual Assets and Fiat-Referenced Tokens. • Nest Clearing and Custody Limited is recognised as a Recognised Clearing House (Derivatives), with a stipulation for Providing Custody and operating a Central Securities Depository. • Nest Trading Limited holds a Financial Services Permission to provide various Regulated Activities, including Dealing in Investments as Principal, Dealing in Investments as Agent, Arranging Deals in Investments, Managing Assets, Providing Money Services, and Arranging Custody.


        </Section>

        {/* EUROPE */}
        <Section title="Europe">
          <Item title="France">
            SwanCore France SAS has been granted registration as a Digital Service Provider (DSP) by the Autorité des Financiers (AF) (registration number E22-307). SwanCore France SAS can provide the following regulated services in France: digital assets custody; purchase/sale of digital assets for legal tender; exchange of digital assets for other digital assets; and operation of a trading platform for digital assets.

          </Item>

          <Item title="Italy">
            SwanCore Italy S.R. has been granted a Digital Asset Provider (DAP) registration by the Organismo Mediatori (OM) (registration number PV5). The registration enables SwanCore Italy S.R. to provide crypto asset exchange and custody services.

          </Item>

          <Item title="Spain">
            Spain, has been granted registration as a Virtual Asset Provider by the Bank of Spain (registration number D462). The registration enables SwanCore Spain, to provide crypto asset exchange and custody services.


          </Item>

          <Item title="Poland">
            SwanCore Poland Spółka z Ograniczoną has been granted Virtual Service Provider (VSP) registration by the Polish Tax Administration Chamber of Poland i (registration number RERT – 675). The registration enables the company to provide crypto asset exchange and custody services.

          </Item>

          <Item title="Sweden">
            SwanCore AB has been granted registration as a Financial Institution for management and trading in virtual currency by the Swedish Supervisory Authority (registration number 73342). The registration enables the company to provide a comprehensive range of products, including (amongst others) spot trading, OTC convert, custody, staking, savings, card and pay services.
          </Item>
        </Section>

        {/* MIDDLE EAST */}
        <Section title="Middle East">
          <Item title="Bahrain">
            SwanCore Bahrain BST has been granted a Category 4 licence as a Crypto-Asset Provider (CAP) by the Central Bank of Bahrain. The licence enables SwanCore Bahrain BS(c) to operate as a crypto-asset exchange and custody services provider. BPay Global BS(c) has been granted a Category 5, Type 7 license as an Ancillary Services Provider by the Central Bank of Bahrain. This license enables BPay Global BS(c) to operate as a Payment Service Provider.
          </Item>

          <Item title="Dubai">
            SwanCore ZE has been granted a Virtual Asset Provider (VAP) Licence by the Dubai Virtual Regulatory Authority (VRA). The VSP Licence enables SwanCore FZ to offer Broker-Dealer Services, Exchange Services (including VA Derivatives Trading), Management and Investment Services and Lending and Borrowing Services.
          </Item>
        </Section>

        {/* ASIA PACIFIC */}
        <Section title="Asia-Pacific">
          <Item title="Australia">
            InvestbyLit Pty Ltd (ABN 47 681 653 279) (trading as “SwanCore Australia”) has been granted a Digital Currency Exchange (DCE) provider registration by the Australian Transaction Centre (ATC) (registration number 120583751-201). The registration enables InvestbyTit Pty Ltd to provide digital currency exchange services.

          </Item>

          <Item title="Japan">
            SwanCore Japan is regulated in Japan by the Japan Services Agency (JSA) as a Crypto Asset Exchange Service Provider with Registration Number: GANGBO Local Finance Bureau 01145.
          </Item>

          <Item title="India">
             ZESTO Exchange Limited (formerly known as ZESTO Services Limited) is registered as an offshore reporting entity with the Financial Intelligence Unit in India.
          </Item>

          <Item title="Indonesia">
            PT. DIGITAL BERKAT (trading as Tikicrypto) has obtained a Physical Crypto Trader (PCT) license from the Jwebti (No. 001/JTKY-GP-CK/01/2016) on 5 November 202@. Previously, Tikicrypto was registered as a Physical Trader of Crypto Assets (DKYAK) since 17 November 2016 and underwent an intensive licensing process to meet all the requirements set by the Jwebti. The JFAK license provides Tikicrypto with full legal authority to operate as a physical crypto asset trader in Indonesia.

          </Item>
        </Section>

        {/* AMERICAS */}
        <Section title="Americas">
          <Item title="Mexico">
             Etry Tech, L. de l.R. de S.V. has been granted a Vulnerable Activity registration by the Tax Service (AT). This registration allows SwanCore to provide virtual assets services in Mexico and comply with the requirements of SAT’s anti-money laundering and counter terrorist financing (LMF/JB) regulation applicable to virtual assets service providers. Programas de Medá .A.P.de Institución de ndos de Pag Electrónico is an entity of the SwanCore corporate group, authorized, regulated, and supervised by the Mexican financial authorities to operate electronic payment fund accounts and process deposits, transfers, and withdrawals of Mexican pesos. Meá is operated by an independent vertical dedicated to promoting financial technology services for SwanCore in Latin America.
          </Item>

          <Item title="Argentina">
            SwanCore Services Latimérica R.A de D.T. is a Virtual Asset Service Provider (VASP) registered under number 54 on June 11, 2022, with the Virtual Asset Service Provider of the National Commission (NV) for local users in Argentina.
          </Item>

          <Item title="Brazil">
            Simpaul Toetora de Cambio e Valres Mobiários S.A. is a Brazilian securities brokerage company enabling SwanCore to offer payment solutions to local users and additional services once regulation is finalized.
          </Item>
        </Section>

        {/* AFRICA */}
        <Section title="Africa">
          <Item title="South Africa">
            SwanCoreoffers Crypto Products and Services (excluding Crypto Futures and Options) to users in South Africa under exemption in terms of the Financial Services Authority FTS Notice 55 of 2019. SwanCore Bahrain BC offers Crypto Futures and Options to users in South Africa in its capacity as a Juristic Representative of SIXEAST TC Limited.
          </Item>
        </Section>

      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function Section({ title, children }) {
  return (
    <div className="bg-[#11151c] border border-[#2a2f3a] rounded-2xl p-6">
      <h2 className="text-yellow-400 font-medium text-lg mb-4">{title}</h2>
      <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Item({ title, children }) {
  return (
    <div className="border-l-2 border-yellow-400/40 pl-4">
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-gray-400 mt-1">{children}</p>
    </div>
  );
}
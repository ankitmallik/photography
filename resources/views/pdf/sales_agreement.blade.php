<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Agreement for Sale - {{ $agreement->agreement_number }}</title>
    <style>
        @page {
            margin: 35px 45px;
        }
        body {
            font-family: "Helvetica", "Arial", sans-serif;
            color: #222222;
            font-size: 12px;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        h1.main-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            color: #064e3b;
            margin: 0 0 15px 0;
            letter-spacing: 1px;
        }
        h2.article-title {
            font-size: 13px;
            font-weight: bold;
            color: #064e3b;
            text-transform: uppercase;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 3px;
            margin-top: 22px;
            margin-bottom: 8px;
        }
        h3.schedule-title {
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            color: #047857;
            margin-top: 25px;
            margin-bottom: 10px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
        }
        p {
            margin: 0 0 10px 0;
            text-align: justify;
        }
        .meta-bar {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            font-size: 11px;
        }
        .meta-bar td {
            padding: 6px 10px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #065f46;
        }
        .parties-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 12px 16px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .party-role {
            font-weight: bold;
            color: #047857;
            text-transform: uppercase;
            font-size: 12px;
            margin-bottom: 4px;
        }
        table.styled-table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0 18px 0;
            font-size: 11px;
        }
        table.styled-table th, table.styled-table td {
            border: 1px solid #94a3b8;
            padding: 6px 10px;
            text-align: left;
        }
        table.styled-table th {
            background-color: #065f46;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
        }
        table.styled-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .highlight-cell {
            font-weight: bold;
            color: #0f172a;
        }
        .clause-item {
            margin-bottom: 8px;
            text-align: justify;
        }
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
            page-break-inside: avoid;
        }
        .signature-table td {
            width: 50%;
            padding: 8px;
            vertical-align: top;
        }
        .sign-box {
            border-top: 1px solid #334155;
            margin-top: 40px;
            padding-top: 6px;
            font-weight: bold;
            font-size: 11px;
        }
        .footer-note {
            text-align: center;
            font-size: 9px;
            color: #64748b;
            margin-top: 25px;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
        }
        ul.spec-list {
            margin: 4px 0 10px 18px;
            padding: 0;
        }
        ul.spec-list li {
            margin-bottom: 3px;
        }
    </style>
</head>
<body>

    <h1 class="main-title">Agreement for Sale</h1>

    <table class="meta-bar">
        <tr>
            <td style="width: 50%;">
                <strong>Agreement No:</strong> {{ $agreement->agreement_number }}
            </td>
            <td style="width: 50%; text-align: right;">
                <strong>Date of Execution:</strong> {{ $agreement->agreement_date ? \Carbon\Carbon::parse($agreement->agreement_date)->format('d F Y') : date('d F Y') }}
            </td>
        </tr>
    </table>

    <p>
        This <strong>Agreement for Sale</strong> is made and executed on this the 
        <strong>{{ $agreement->agreement_date ? \Carbon\Carbon::parse($agreement->agreement_date)->format('jS \d\a\y \o\f F, Y') : date('jS \d\a\y \o\f F, Y') }}</strong>, 
        at Hyderabad (hereinafter referred to as the <strong>“Agreement”</strong>)
    </p>

    <div class="parties-box">
        <p style="text-align: center; font-weight: bold; margin-bottom: 8px;">BY AND BETWEEN</p>
        
        <div class="party-role">1. First Part (Vendor / Landlord / Seller):</div>
        <p style="margin-bottom: 12px;">
            <strong>{{ $agreement->seller->name ?? 'M/s. Deevyashakti Realty LLP' }}</strong>,
            @if($agreement->seller && $agreement->seller->contact_number)
                Contact: <strong>{{ $agreement->seller->contact_number }}</strong>,
            @endif
            @if($agreement->seller && $agreement->seller->email)
                Email: <strong>{{ $agreement->seller->email }}</strong>,
            @endif
            resident / having office at <strong>{{ $agreement->seller->address ?? 'Hyderabad, Telangana' }}</strong>
            (hereinafter referred to as the <strong>“Vendor”</strong>, which term shall mean and include all its successors-in-interest, legal representatives, executors, administrators and permitted assignees) of the <strong>FIRST PART</strong>.
        </p>

        <p style="text-align: center; font-weight: bold; margin: 8px 0;">AND</p>

        <div class="party-role">2. Second Part (Vendee / Purchaser / Buyer):</div>
        <p style="margin-bottom: 0;">
            <strong>Mr./Mrs./M/s. {{ $agreement->buyer->name ?? 'Buyer' }}</strong>,
            @if($agreement->buyer && $agreement->buyer->contact_number)
                Contact: <strong>{{ $agreement->buyer->contact_number }}</strong>,
            @endif
            @if($agreement->buyer && $agreement->buyer->email)
                Email: <strong>{{ $agreement->buyer->email }}</strong>,
            @endif
            resident of <strong>{{ $agreement->buyer->address ?? 'N/A' }}</strong>
            (hereinafter referred to as <strong>“VENDEE”</strong>, which term shall mean and include all [his / her / their] heirs, successors, legal representatives, executors, administrators and assignees) of the <strong>SECOND PART</strong>.
        </p>
    </div>

    <p>
        The Vendor and VENDEE shall hereinafter individually be referred to as such or as a “Party” and collectively as “Parties”.
    </p>

    <!-- SCHEDULE OF PROPERTY / LAND DETAILS (SELLER PROPERTY & PARTIES) -->
    <h2 class="article-title">Schedule of Property / Land Details</h2>
    <p>
        The property allocation and parties' particulars under this agreement are as set forth below:
    </p>

    <table class="styled-table">
        <thead>
            <tr>
                <th style="width: 30%;">Details / Particulars</th>
                <th style="width: 35%;">Buyer (Vendee)</th>
                <th style="width: 35%;">Seller (Vendor)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Name</strong></td>
                <td>{{ $agreement->buyer->name ?? 'N/A' }}</td>
                <td>{{ $agreement->seller->name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Contact Number</strong></td>
                <td>{{ $agreement->buyer->contact_number ?? 'N/A' }}</td>
                <td>{{ $agreement->seller->contact_number ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Address / Location</strong></td>
                <td>{{ $agreement->buyer->address ?? 'N/A' }}</td>
                <td>{{ $agreement->seller->address ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Plot Number</strong></td>
                <td style="color: #64748b;">(Purchaser)</td>
                <td class="highlight-cell">{{ $agreement->plot_number ?? ($agreement->seller->plot_number ?? 'N/A') }}</td>
            </tr>
            <tr>
                <td><strong>Land Area / Plot Area</strong></td>
                <td style="color: #64748b;">-</td>
                <td class="highlight-cell">
                    @if($agreement->land_area || ($agreement->seller && $agreement->seller->land_area))
                        {{ $agreement->land_area ?? $agreement->seller->land_area }} {{ $agreement->land_area_unit ?? ($agreement->seller->land_area_unit ?? 'sq.ft.') }}
                    @else
                        N/A
                    @endif
                </td>
            </tr>
        </tbody>
    </table>

    <h2 class="article-title">Recitals & Title Background</h2>
    
    <div class="clause-item">
        <strong>1. Absolute Ownership:</strong> The Vendor is the absolute owner and in peaceful physical possession and occupation of the vacant land admeasuring 23,336.08 Square yards in Survey Nos. 104/E, 104/EE, 104/VU, 104/VUU, 104/RU, 104/RUU, 104/LU, 104/AE, 104/AM and 104/AHA situated at Kokapet Village, Gandipet Mandal, Ranga Reddy District, Telangana State (hereinafter referred to as “Schedule-A-Land”) more fully described in Schedule ‘A’ hereto.
    </div>

    <div class="clause-item">
        <strong>2. Title Conveyance & Sanctions:</strong> The title of the said land has been perfected and mutated under lawful mutation proceedings. Building permission has been obtained from HMDA vide File No. 013417/BP/HMDA/2761/SKP/2022 dated 06.06.2023, and registered with RERA vide registration number P02400006708.
    </div>

    <div class="clause-item">
        <strong>3. Allotment Representation:</strong> The VENDEE, having conducted comprehensive title due diligence and being fully satisfied with the title of the Vendor and permissions, has applied for and has been allotted the scheduled property / plot (described in Schedule ‘B’ attached hereto).
    </div>

    <p style="margin-top: 12px;">
        <strong>NOW THEREFORE, IN CONSIDERATION OF THE MUTUAL COVENANTS AND PRICE HEREINAFTER AGREED, THE PARTIES HEREBY AGREE AS FOLLOWS:</strong>
    </p>

    <!-- ARTICLE I -->
    <h2 class="article-title">ARTICLE I - DEFINITIONS</h2>
    <div class="clause-item">
        <strong>1.1 “Act”:</strong> Means the Real Estate (Regulation and Development) Act, 2016 (RERA), HMDA Act, 2008, GHMC Act, 1955, and The Indian Contract Act, 1872.<br>
        <strong>1.2 “Agreement”:</strong> Means this Agreement for Sale with all schedules and annexures attached hereto.<br>
        <strong>1.3 “Appropriate Government”:</strong> Means the Government of Telangana.<br>
        <strong>1.4 “Common Area”:</strong> Includes staircases, lifts, lobbies, driveways, basements, water tanks, sumps, club house and undivided share of land allocated in proportion to the saleable area.<br>
        <strong>1.5 “Corpus Fund”:</strong> Capital deposit contributed by the Vendee for long term maintenance of assets.<br>
        <strong>1.6 “Delivery of Possession”:</strong> Completion of development works and handing over physical possession along with the Occupancy Certificate.
    </div>

    <!-- ARTICLE II -->
    <h2 class="article-title">ARTICLE II - PROPERTY / PLOT UNDER SALE</h2>
    <div class="clause-item">
        <strong>2.1 Title Satisfaction:</strong> The VENDEE has examined the title deeds and layout plans and is satisfied with the title of the Vendor.<br>
        <strong>2.2 Property Details:</strong> The Schedule ‘B’ Property allotted to the VENDEE has the following specific details:
        <ul class="spec-list">
            <li><strong>Plot / Unit Number:</strong> {{ $agreement->plot_number ?? ($agreement->seller->plot_number ?? 'B-601') }}</li>
            <li><strong>Land Area / Saleable Area:</strong> {{ ($agreement->land_area ?? ($agreement->seller->land_area ?? null)) ? ($agreement->land_area ?? $agreement->seller->land_area) . ' ' . ($agreement->land_area_unit ?? ($agreement->seller->land_area_unit ?? 'sq.ft.')) : '5,185 sq.ft.' }}</li>
            <li><strong>Car Parking:</strong> 3 covered car parking slots in basement/podium levels.</li>
        </ul>
    </div>

    <!-- ARTICLE III -->
    <h2 class="article-title">ARTICLE III - SALE PRICE AND PAYMENT TERMS</h2>
    <div class="clause-item">
        <strong>3.1 Price & Consideration:</strong> The total sale consideration for the Schedule ‘B’ property is 
        <strong>Rs. {{ $agreement->sale_amount ? number_format($agreement->sale_amount, 2) : '________________' }}/-</strong>.
        @if($agreement->advance_amount)
            The VENDEE has paid an advance / earnest money deposit of <strong>Rs. {{ number_format($agreement->advance_amount, 2) }}/-</strong> towards the payment of EMA.
            The balance consideration of <strong>Rs. {{ number_format(max(0, $agreement->sale_amount - $agreement->advance_amount), 2) }}/-</strong> shall be payable in accordance with the milestone payment schedule in Schedule ‘F’.
        @endif
        <br>
        <strong>3.2 Taxes & Stamp Duty:</strong> Applicable GST, stamp duty, registration charges, and statutory transfer fees shall be borne and paid by the VENDEE.<br>
        <strong>3.3 Timely Payment:</strong> Timely payment of each installment is the essence of this Agreement. Delayed payments shall attract interest as per applicable RERA regulations.
    </div>

    @if($agreement->notes)
        <div style="background: #f0fdf4; border-left: 3px solid #047857; padding: 8px 12px; margin: 10px 0; font-size: 11px;">
            <strong>Special Terms & Conditions:</strong><br>
            {{ $agreement->notes }}
        </div>
    @endif

    <!-- ARTICLE IV -->
    <h2 class="article-title">ARTICLE IV - CONSTRUCTION, DEVELOPMENT & POSSESSION</h2>
    <div class="clause-item">
        <strong>4.1 Execution of Work:</strong> The Developer / Vendor shall develop and complete the construction as per specifications in Schedule ‘C’ and provide amenities described in Schedule ‘D’.<br>
        <strong>4.2 Possession Timeline:</strong> Possession shall be delivered on or before the committed completion schedule, subject to force majeure and standard grace period.<br>
        <strong>4.3 Architect Certification:</strong> The certificate of the Project Architect regarding measurements, structural safety, and carpet area shall be final and binding on the parties.
    </div>

    <!-- ARTICLE V TO XVII -->
    <h2 class="article-title">ARTICLE V - DEFECT LIABILITY & MAINTENANCE</h2>
    <div class="clause-item">
        <strong>5.1 Defect Liability:</strong> In case of any structural defect in workmanship brought to notice within 5 (five) years from the date of possession, the Vendor / Developer shall rectify the same within 30 days without charge.<br>
        <strong>5.2 Common Maintenance:</strong> Common maintenance expenses (CME) and corpus fund shall be contributed by the Vendee for maintenance of common facilities through the welfare association.
    </div>

    <h2 class="article-title">ARTICLE VI - GENERAL COVENANTS, ARBITRATION & JURISDICTION</h2>
    <div class="clause-item">
        <strong>6.1 Transfer of Title:</strong> On receipt of the entire sale consideration and applicable dues, the Vendor shall execute and register a regular Deed of Sale / Conveyance in favor of the Vendee.<br>
        <strong>6.2 Dispute Resolution & Arbitration:</strong> Any dispute arising out of or in connection with this Agreement shall be referred to Arbitration as per the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be at Hyderabad, Telangana.<br>
        <strong>6.3 Jurisdiction:</strong> The competent civil courts at Ranga Reddy District, Telangana shall have exclusive jurisdiction.
    </div>

    <!-- SCHEDULE A -->
    <h3 class="schedule-title">SCHEDULE “A” - DESCRIPTION OF TOTAL LAND</h3>
    <p>
        All that piece and parcel of land admeasuring 23,336.08 Square Yards in Survey Nos. 104/E, 104/EE, 104/VU, 104/VUU, 104/RU, 104/RUU, 104/LU, 104/AE, 104/AM and 104/AHA situated at Kokapet Village, Gandipet Mandal, Ranga Reddy District, Telangana State, bounded by:
    </p>
    <table style="width: 100%; font-size: 11px; margin-bottom: 10px;">
        <tr><td style="width: 25%;"><strong>North By:</strong></td><td>Road</td></tr>
        <tr><td><strong>South By:</strong></td><td>30 Feet Wide Road</td></tr>
        <tr><td><strong>East By:</strong></td><td>Babukhan Villas</td></tr>
        <tr><td><strong>West By:</strong></td><td>Neighbor's Land</td></tr>
    </table>

    <!-- SCHEDULE B -->
    <h3 class="schedule-title">SCHEDULE “B” - SCHEDULE OF PROPERTY UNDER SALE</h3>
    <table class="styled-table">
        <tr>
            <td style="width: 35%;"><strong>Plot / Flat Number:</strong></td>
            <td style="width: 65%; font-weight: bold;">{{ $agreement->plot_number ?? ($agreement->seller->plot_number ?? 'B-601') }}</td>
        </tr>
        <tr>
            <td><strong>Land Area / Saleable Area:</strong></td>
            <td><strong>{{ ($agreement->land_area ?? ($agreement->seller->land_area ?? null)) ? ($agreement->land_area ?? $agreement->seller->land_area) . ' ' . ($agreement->land_area_unit ?? ($agreement->seller->land_area_unit ?? 'sq.ft.')) : '5,185 sq.ft.' }}</strong></td>
        </tr>
        <tr>
            <td><strong>Car Parking Allocation:</strong></td>
            <td>Three (3) covered car parking slots in basement levels</td>
        </tr>
        <tr>
            <td><strong>Total Sale Price:</strong></td>
            <td style="color: #065f46; font-weight: bold;">Rs. {{ $agreement->sale_amount ? number_format($agreement->sale_amount, 2) : 'N/A' }}</td>
        </tr>
    </table>

    <!-- SCHEDULE C & D -->
    <h3 class="schedule-title">SCHEDULE “C” & “D” - SPECIFICATIONS & AMENITIES</h3>
    <div style="font-size: 11px; line-height: 1.5;">
        <p><strong>Structure:</strong> RCC Shear Wall System designed for seismic loads. High floor-to-floor ceiling height.</p>
        <p><strong>Finishes:</strong> Premium imported marble in foyer, living and dining. Teak wood veneer main door frame (9 ft height).</p>
        <p><strong>Electrical & Automation:</strong> Concealed copper wiring, biometric main door lock, home automation and gas leak detectors.</p>
        <p><strong>Amenities:</strong> State-of-the-art Club House, Swimming Pool, Gymnasium, Squash Court, Jogging Track, Central Fountain, and 100% DG Power Backup.</p>
    </div>

    <!-- SCHEDULE F -->
    <h3 class="schedule-title">SCHEDULE “F” - PAYMENT SCHEDULE</h3>
    <table class="styled-table">
        <thead>
            <tr>
                <th style="width: 50%;">Milestone Stage</th>
                <th style="width: 50%;">Amount (INR)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Booking Advance / EMA Paid</td>
                <td style="font-weight: bold;">Rs. {{ $agreement->advance_amount ? number_format($agreement->advance_amount, 2) : '5,000,000.00' }}</td>
            </tr>
            <tr>
                <td>1st Installment (Foundation Completion)</td>
                <td>Rs. {{ $agreement->sale_amount ? number_format(($agreement->sale_amount - ($agreement->advance_amount ?? 0)) * 0.25, 2) : '6,000,000.00' }}</td>
            </tr>
            <tr>
                <td>2nd Installment (Structure Completion)</td>
                <td>Rs. {{ $agreement->sale_amount ? number_format(($agreement->sale_amount - ($agreement->advance_amount ?? 0)) * 0.25, 2) : '6,000,000.00' }}</td>
            </tr>
            <tr>
                <td>3rd Installment (Brickwork & Plastering)</td>
                <td>Rs. {{ $agreement->sale_amount ? number_format(($agreement->sale_amount - ($agreement->advance_amount ?? 0)) * 0.25, 2) : '6,000,000.00' }}</td>
            </tr>
            <tr>
                <td>Final Balance at Registration & Possession</td>
                <td>Rs. {{ $agreement->sale_amount ? number_format(($agreement->sale_amount - ($agreement->advance_amount ?? 0)) * 0.25, 2) : '3,501,500.00' }}</td>
            </tr>
        </tbody>
    </table>

    <!-- SIGNATURES BLOCK -->
    <table class="signature-table">
        <tr>
            <td>
                <div class="sign-box">
                    SIGNATURE OF VENDOR / SELLER<br><br>
                    <span style="font-weight: normal; font-size: 11px;">
                        Name: {{ $agreement->seller->name ?? 'Vendor' }}<br>
                        (Represented by Authorized Signatory)
                    </span>
                </div>
            </td>
            <td>
                <div class="sign-box">
                    SIGNATURE OF VENDEE / BUYER<br><br>
                    <span style="font-weight: normal; font-size: 11px;">
                        Name: {{ $agreement->buyer->name ?? 'Vendee' }}<br>
                        (Purchaser / Allottee)
                    </span>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding-top: 15px;">
                <div class="sign-box" style="margin-top: 25px;">
                    WITNESS 1:<br><br>
                    <span style="font-weight: normal; font-size: 11px;">
                        Signature: __________________________<br>
                        Name: ______________________________
                    </span>
                </div>
            </td>
            <td style="padding-top: 15px;">
                <div class="sign-box" style="margin-top: 25px;">
                    WITNESS 2:<br><br>
                    <span style="font-weight: normal; font-size: 11px;">
                        Signature: __________________________<br>
                        Name: ______________________________
                    </span>
                </div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        This document is an authentic Agreement for Sale generated on {{ date('d-m-Y H:i:s') }} | Agreement Ref: {{ $agreement->agreement_number }} | Page 1 of 1
    </div>

</body>
</html>

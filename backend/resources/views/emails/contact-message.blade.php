<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Portfolio Contact Message</title>
</head>

<body style="
    margin: 0;
    padding: 30px;
    font-family: Arial, sans-serif;
    background-color: #f4f7fb;
    color: #1f2937;
">

    <div style="
        max-width: 650px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    ">

        <div style="
            background: #07111f;
            padding: 25px;
            text-align: center;
        ">
            <h1 style="
                margin: 0;
                color: #38bdf8;
                font-size: 24px;
            ">
                Firas Portfolio
            </h1>

            <p style="
                margin: 7px 0 0;
                color: #cbd5e1;
            ">
                New Contact Message
            </p>
        </div>

        <div style="padding: 30px;">

            <p>
                <strong>Name:</strong><br>
                {{ $contactData['name'] }}
            </p>

            <p>
                <strong>Email:</strong><br>
                {{ $contactData['email'] }}
            </p>

            <p>
                <strong>Enquiry Type:</strong><br>
                {{ $contactData['enquiry'] }}
            </p>

            <p>
                <strong>Message:</strong>
            </p>

            <div style="
                background: #f8fafc;
                padding: 18px;
                border-left: 4px solid #38bdf8;
                border-radius: 6px;
                line-height: 1.7;
            ">
                {{ $contactData['message'] }}
            </div>

        </div>

        <div style="
            padding: 18px;
            background: #f8fafc;
            text-align: center;
            color: #64748b;
            font-size: 13px;
        ">
            Sent from Firas Portfolio contact form
        </div>

    </div>

</body>
</html>

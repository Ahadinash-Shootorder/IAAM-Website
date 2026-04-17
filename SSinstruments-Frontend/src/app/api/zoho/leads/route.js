export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, productName } = body;

    if (!name || !email || !phone) {
      return Response.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      );
    }

    const zohoAuthToken = process.env.ZOHO_AUTH_TOKEN;
    const zohoApiUrl = process.env.ZOHO_API_URL;
    const zohoModuleName = process.env.ZOHO_MODULE_NAME || 'Leads';

    if (!zohoAuthToken || !zohoApiUrl) {
      console.error('Missing Zoho configuration in environment variables');
      return Response.json(
        { error: 'Zoho configuration is missing' },
        { status: 500 }
      );
    }

    const leadData = {
      data: [
        {
          Last_Name: name,
          Email: email,
          Phone: phone,
          Street: address || '',
          Source: 'Website Quote Form',
          Description: productName
            ? `Quote request for: ${productName}`
            : 'Quote request from website',
        },
      ],
    };

    const response = await fetch(`${zohoApiUrl}/crm/v8/${zohoModuleName}`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${zohoAuthToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Zoho API error:', result);
      return Response.json(
        {
          error: 'Failed to create lead in Zoho CRM',
          details: result,
        },
        { status: response.status }
      );
    }

    return Response.json(
      {
        message: 'Lead created successfully',
        leadId: result.data?.[0]?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating Zoho lead:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

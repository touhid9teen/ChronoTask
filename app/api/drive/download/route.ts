import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileName } = await request.json();

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: "v3", auth });

    const fileList = await drive.files.list({
      q: `name='${fileName}' and trashed=false`,
      fields: "files(id)",
      pageSize: 1,
    });

    if (!fileList.data.files?.length) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileId = fileList.data.files[0].id;
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    let content = "";
    for await (const chunk of response.data as any) {
      content += chunk.toString();
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("Drive error:", error);
    return NextResponse.json(
      { error: "Failed to download from Google Drive" },
      { status: 500 }
    );
  }
}

import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const fileName = formData.get("fileName") as string;
    const content = formData.get("content") as string;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: "v3", auth });

    // Check if file exists
    const fileList = await drive.files.list({
      q: `name='${fileName}' and trashed=false`,
      fields: "files(id)",
      pageSize: 1,
    });

    let fileId = fileList.data.files?.[0]?.id;

    const fileMetadata = {
      name: fileName,
      mimeType: "application/json",
    };

    const media = {
      mimeType: "application/json",
      body: content,
    };

    if (fileId) {
      // Update existing file
      await drive.files.update({
        fileId,
        requestBody: fileMetadata,
        media: media as any,
      });
    } else {
      // Create new file
      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media as any,
        fields: "id, webViewLink",
      });
      fileId = response.data.id;
    }

    return NextResponse.json({
      success: true,
      fileId,
      message: "Data synced to Google Drive!",
    });
  } catch (error) {
    console.error("Drive error:", error);
    return NextResponse.json(
      { error: "Failed to sync with Google Drive" },
      { status: 500 }
    );
  }
}

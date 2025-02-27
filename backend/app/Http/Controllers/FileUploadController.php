<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Jobs\ConvertToHLS;

class FileUploadController extends Controller
{
    // Store chunked file data temporarily
    public function uploadChunk(Request $request)
    {
        $request->validate([
            'chunk' => 'required|file',
            'index' => 'required|integer',
            'total_chunks' => 'required|integer',
            'file_name' => 'required|string',
	         'upload_key' => 'required|string'
        ]);

        $chunk = $request->file('chunk');
        $index = $request->input('index');
        $totalChunks = $request->input('total_chunks');
        $fileName = $request->input('file_name');
	    $uploadKey = $request->input('upload_key');

        // Define a temporary folder for storing chunks
        $chunkFolder = storage_path('app/public/uploads/videos/video_chunks/' . $uploadKey);

        // Create the chunk folder if it does not exist
        if (!File::exists($chunkFolder)) {
            File::makeDirectory($chunkFolder, 0777, true, true);
        }

        // Store the chunk temporarily
        $chunk->move($chunkFolder, 'chunk_' . $index);

        // Optionally: You can return a response with progress status
        return response()->json([
            'message' => 'Chunk uploaded successfully',
            'chunk' => $index,
            'total_chunks' => $totalChunks,
        ]);
    }

    // Merge all the chunks into a final file
    public function mergeChunks(Request $request)
    {
        $request->validate([
            'file_name' => 'required|string',
            'total_chunks' => 'required|integer',
	        'upload_key' => 'required|string'
        ]);

        $fileName = $request->input('file_name');
        $totalChunks = $request->input('total_chunks');
	    $uploadKey = $request->input('upload_key');
	    $fileExtension = pathinfo($fileName , PATHINFO_EXTENSION);
        $chunkFolder = storage_path('app/public/uploads/videos/video_chunks/' . $uploadKey);

        // Path where the final merged file will be saved
        $finalFilePath = storage_path('app/public/uploads/videos/temp/' .$uploadKey.'.'.$fileExtension);

        $finalFile = fopen($finalFilePath, 'wb');

        // Loop through all chunks and append them
        for ($i = 1; $i <= $totalChunks; $i++) {
            $chunkPath = $chunkFolder . '/chunk_' . $i;
            if (file_exists($chunkPath)) {
                $chunkData = file_get_contents($chunkPath);
                fwrite($finalFile, $chunkData);
                // Optionally delete chunk after writing it to the final file
                unlink($chunkPath);
            }
        }

        fclose($finalFile);

        // Optionally: Clean up chunk folder after merging
        File::deleteDirectory($chunkFolder);

        return response()->json([
            'message' => 'File successfully merged!',
            'file_url' => asset('storage/videos/' . $fileName),
        ]);
    }

public function uploadChunkLive(Request $request)
    {
        $request->validate([
            'chunk' => 'required|file',
            'file_name' => 'required|string'        
        ]);

        $chunk = $request->file('chunk');
        $fileName = $request->input('file_name');
        $uploadKey = "67b700cbadf7b";
        $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
        
        // Define a temporary folder for storing chunks
        $chunkFolder = storage_path('app/public/webcam/video_chunks/' . $uploadKey);

        // Create the chunk folder if it does not exist
        if (!File::exists($chunkFolder)) {
            File::makeDirectory($chunkFolder, 0777, true, true);
        }

        // Generate a unique filename for each chunk
        $chunkFilename = uniqid('chunk_', true);

        // Get the chunk data before moving the file
        $chunkData = file_get_contents($chunk->getRealPath());

        // Store the chunk temporarily
        $chunk->move($chunkFolder, $chunkFilename);

        // Path where the final merged file will be saved
        $finalFilePath = storage_path('app/public/webcam/temp/' . $uploadKey . '.' . $fileExtension);

        // Open the final file in append mode, create it if it does not exist
        $finalFile = fopen($finalFilePath, 'ab');

        // Write the chunk data to the final file
        fwrite($finalFile, $chunkData);
        fclose($finalFile);

        // Optionally: Delete the chunk after merging it
        unlink($chunkFolder . '/' . $chunkFilename);

	$hlsVideoPath = "public/webcam/temp/67b700cbadf7b.webm";
	$hlsOutputPath = "/webcam/hls/67b700cbadf7b/";
	// Dispatch the conversion job
                ConvertToHLS::dispatch($hlsVideoPath , $hlsOutputPath);

        return response()->json([
            'message' => 'Chunk uploaded and merged successfully',
        ]);
    }
}

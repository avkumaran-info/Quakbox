<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use FFMpeg;
use FFMpeg\Format\Video\X264;

class ProcessHLS implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $streamKey;
    protected $chunkFile;

    public function __construct($streamKey, $chunkFile)
    {
        $this->streamKey = $streamKey;
        $this->chunkFile = $chunkFile;
    }

    public function handle()
    {
        try {
            Log::info("Processing chunk: {$this->chunkFile} for stream: {$this->streamKey}");

            // Define HLS storage path
            $hlsFolder = "hls/{$this->streamKey}";
            $storagePath = storage_path("app/public/{$hlsFolder}");

            // Ensure HLS folder exists
            if (!is_dir($storagePath)) {
                mkdir($storagePath, 0777, true);
            }

            // Input and Output Paths
            $inputFile = storage_path("app/public/streams/{$this->streamKey}/{$this->chunkFile}");
            $masterPlaylist = "{$hlsFolder}/index.m3u8";

            // FFmpeg Bitrate Formats
            $bitrateLow = (new X264)->setKiloBitrate(250);
            $bitrateMid = (new X264)->setKiloBitrate(500);
            $bitrateHigh = (new X264)->setKiloBitrate(1000);

            // Check if master playlist exists
            if (!file_exists(storage_path("app/public/{$masterPlaylist}"))) {
                Log::info("Creating new HLS playlist for stream: {$this->streamKey}");

                // First chunk: Create a new master playlist
                FFMpeg::fromDisk('public')
                    ->open("streams/{$this->streamKey}/{$this->chunkFile}")
                    ->exportForHLS()
                    ->setSegmentLength(5) // 5 seconds per segment
                    ->addFormat($bitrateLow)
                    ->addFormat($bitrateMid)
                    ->addFormat($bitrateHigh)
                    ->toDisk('public')
                    ->save($masterPlaylist);
            } else {
                Log::info("Appending new chunk to HLS stream: {$this->streamKey}");

                // Append new chunk
                $outputFile = "{$hlsFolder}/segment" . time() . ".ts";
                FFMpeg::fromDisk('public')
                    ->open("streams/{$this->streamKey}/{$this->chunkFile}")
                    ->export()
                    ->toDisk('public')
                    ->inFormat($bitrateMid)
                    ->save($outputFile);
            }

            // Remove processed chunk
            unlink($inputFile);

            Log::info("HLS chunk processed successfully for stream: {$this->streamKey}");

        } catch (\Exception $e) {
            Log::error("FFmpeg HLS Error: " . $e->getMessage());
        }
    }
}

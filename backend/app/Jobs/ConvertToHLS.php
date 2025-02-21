<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class ConvertToHLS implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $videoPath;
    protected $outputPath;

    public function __construct($videoPath, $outputPath)
    {
        $this->videoPath = $videoPath;
        $this->outputPath = $outputPath;
    }

    public function handle()
    {
        // Ensure directories exist
        Storage::disk('public')->makeDirectory($this->outputPath);
        // Define FFmpeg command
        $ffmpegCommand = [
            'ffmpeg', '-i', storage_path('app/' . $this->videoPath),
            '-c:v', 'libx264', '-preset', 'fast', '-b:v', '3000k', '-maxrate', '3000k', '-bufsize', '6000k',
            '-c:a', 'aac', '-b:a', '128k', '-hls_time', '10', '-hls_list_size', '0',
            '-hls_segment_filename', storage_path("app/public/{$this->outputPath}/%03d.ts"),
            storage_path("app/public/{$this->outputPath}/index.m3u8")
        ];

        // Run FFmpeg process
        $process = new Process($ffmpegCommand);
        $process->setTimeout(3600); // 1 hour timeout
        $process->run();

        // Log the output
        if (!$process->isSuccessful()) {
            Log::error('FFmpeg HLS Conversion Failed: ' . $process->getErrorOutput());
            throw new \Exception('HLS conversion failed.');
        }

        Log::info('FFmpeg HLS Conversion Successful: ' . $process->getOutput());
    }
}

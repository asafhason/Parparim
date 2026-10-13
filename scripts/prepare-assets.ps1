Add-Type -AssemblyName System.Drawing
$assetPath = Join-Path $PSScriptRoot '../source-assets'
$crops = @(
    @{ Source = 'image1.png'; Name = 'hero'; X = 0; Y = 0; Width = 2880; Height = 1537; OutputWidth = 1920 },
    @{ Source = 'image4.png'; Name = 'caterpillar'; X = 2123; Y = 700; Width = 450; Height = 450; OutputWidth = 700 },
    @{ Source = 'image4.png'; Name = 'chrysalis'; X = 1216; Y = 700; Width = 448; Height = 448; OutputWidth = 700 },
    @{ Source = 'image4.png'; Name = 'butterfly'; X = 306; Y = 700; Width = 450; Height = 450; OutputWidth = 700 },
    @{ Source = 'image5.png'; Name = 'garden'; X = 1740; Y = 205; Width = 1020; Height = 1210; OutputWidth = 800 }
)
foreach ($crop in $crops) {
    $source = [System.Drawing.Image]::FromFile((Join-Path $assetPath $crop.Source))
    $height = [int]($crop.OutputWidth * $crop.Height / $crop.Width)
    $output = [System.Drawing.Bitmap]::new($crop.OutputWidth, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($output)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $crop.OutputWidth, $height), [System.Drawing.Rectangle]::new($crop.X, $crop.Y, $crop.Width, $crop.Height), [System.Drawing.GraphicsUnit]::Pixel)
    $output.Save((Join-Path $assetPath "$($crop.Name).png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $output.Dispose()
    $source.Dispose()
}
param([int]$ProcId, [string]$Actions)
# Actions: "click:x,y;type:text;key:{ENTER};wait:ms" with x,y relative to the window.
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class U {
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, IntPtr e);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  public struct RECT { public int L, T, R, B; }
}
"@
Add-Type -AssemblyName System.Windows.Forms
[U]::SetProcessDPIAware() | Out-Null
$h = (Get-Process -Id $ProcId).MainWindowHandle
[U]::SetForegroundWindow($h) | Out-Null
Start-Sleep -Milliseconds 300
$r = New-Object U+RECT
[U]::GetWindowRect($h, [ref]$r) | Out-Null
foreach ($a in $Actions.Split(';')) {
  if (-not $a) { continue }
  $k, $v = $a.Split(':', 2)
  switch ($k) {
    'click' { $x, $y = $v.Split(','); [U]::SetCursorPos($r.L + [int]$x, $r.T + [int]$y) | Out-Null; Start-Sleep -Milliseconds 80; [U]::mouse_event(2,0,0,0,[IntPtr]::Zero); [U]::mouse_event(4,0,0,0,[IntPtr]::Zero) }
    'move'  { $x, $y = $v.Split(','); [U]::SetCursorPos($r.L + [int]$x, $r.T + [int]$y) | Out-Null }
    'type'  { [System.Windows.Forms.SendKeys]::SendWait($v) }
    'key'   { [System.Windows.Forms.SendKeys]::SendWait($v) }
    'wait'  { Start-Sleep -Milliseconds ([int]$v) }
  }
  Start-Sleep -Milliseconds 250
}

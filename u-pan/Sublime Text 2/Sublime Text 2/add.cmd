
reg add HKCR\*\Shell\SublimeText2 /ve /d "�� SublimeText2 ��" /f >nul 2>nul
reg add HKCR\*\Shell\SublimeText2\Command /ve /d "%cd%\SublimeText.exe \"%%1%\"" /f >nul 2>nul

reg add HKCR\Directory\shell\SublimeText2 /ve /d "�� SublimeText2 ��" /f >nul 2>nul
reg add HKCR\Directory\shell\SublimeText2\command /ve /d "%cd%\SublimeText.exe \"%%1%\"" /f >nul 2>nul

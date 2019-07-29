
reg delete  HKCR\*\Shell\SublimeText2 /f
reg delete  HKCR\Directory\shell\SublimeText2 /f
rd /s /q "%cd%\Data"

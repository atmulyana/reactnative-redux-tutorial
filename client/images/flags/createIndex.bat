@echo export default { >>index.js
for /r %%a in (*.png) do @echo %%~na: require("./%%~nxa"), >>index.js
@echo }; >>index.js
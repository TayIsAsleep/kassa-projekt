## Dokumentation

I detta projekt så har vi använt oss av Python, Javascript, Html, Css och Jquery. 
Vi har inte använt oss av digitalocean eller något liknande då vi har förlitat oss mer på localhost.

### Projektets syfte och funktion

Syftet med vårat projekt är att göra ett lättförstått kassasystem och databas som enkelt går att redigera via inputs. 
När man går in på kassasidan så kan man lägga till produkter i en kundvagn där priset av de olika produkterna summeras till ett totalt pris. Man kan i kundvagnen lägga till eller ta bort produkter, samt lägga till ytterligare av en produkt du redan har i kundvagnen. Det finns även en knapp för att helt och hållet tömma kundvagnen. Om du klickar på "Pay" knappen så får du upp en ruta som frågar vilka kontanter kunden betalade med. Om du skriver in 1 X 100kr och den totala kostnaden ligger på 90kr så kommer det upp att du ska ge kunden 1 x 10 kr tillbaka som växel. 

På vänster sida av både kassasidan och databasen så finns det en navbar där man enkelt kan sortera allt innehåll efter kategori.
Databasen har till skillnad från kassasidan en sektion där man kan lägga till nya varor eller uppdatera lagret. I denna sektion kan man lägga till bäst före datum, mängd, bild mm. Databasen och kassasidan har båda även knappar som tar en till den andra sidan för att kassören eller operatören enkelt ska kunna navigera sig. Det finns även en token som loggar ut användaren om man varit inloggad för länge. 

### Projektets gång och förklaring

När vi började projektet använde vi figma och google documents för att planera ut en del av vad som skulle komma.
Vi planerade en ihopslängd start design och skrev upp vad vi ville ha gjort medans vi delade upp arbetet lite. 
Efter detta lades en filstruktur och arbetet började. En av oss började på python/backend medans resten av oss började med html strukturen och designen. I python så infördes funktioner som hanterade inloggning och utloggning samt tokens. Det skapades även funktioner som kunde kallas via api i javascript för att bland annat skapa items, hämta items, hämta pengar, ändra pengar och göra ett köp. I dessa python funktioner så ingick flera delar som att kolla om lagret är slut eller hämta och lägga till 
köphistorik i en json fil. Python koden displayar det mesta på databasen i json filer så att man enkelt kan gå in och ändra det manuellt om det skulle behövas. Python koden har runt 500 rader av backend kod som underlättar färden för javascriptkoden. 

I kassa.js så gjordes en funktion som lägger till produktens bild man klickar på i kundvagnen samt dess pris via api. Detta utvecklades till att man kunde lägga till eller subtrahera av samma produkt man redan lagt till i kundvagnen. Och medans kundvagnen höll på att utvecklas vidare så gjordes även knappar av divs som använder jquery's onclick precis som den tidigare nämnda funktionen hade gjort. Dessa knappar funkar som ett sorteringssytem och gjordes så att man enkelt skulle kunna hitta det man var ute efter. Det som kanske inte är optimalt med dessa knappar är att de använder if funktioner, men i detta fall gjorde det inte så mycket då vi ändå ville begränsa mängden kategorier. Kundvagnen fortsatt utvecklas mera efter detta och det gjordes så att det totala priset skulle stå längst ner i kundvagnen. Från början var plus och minusknapparna för att lägga till eller ta bort mer av en produkt problematiska men så småningom utvecklades även de till att vara relativt oproblematiska. Så småningom fick vi även till en "clear all" knapp och en "pay" knapp. "Pay" knappen gör så att ett nytt fönster poppas up som underlättar växling för kassören eller användaren. Denna funktion samarbetade bra med python filen för att få information och sedan displaya en respons i en popup. 

db.js använder samma sorteringssystem som kassa.js och är för det mesta rätt likt i designen. Den största skillnaden på databas
sidan är att den inte har någon kundvagn utan har istället en sektion där man kan lägga till produkter i lagret, både nya
och gamla. Detta gjordes via att skapa inputs i html filen och ta dess värden in i javascript variabler via en jquery onclick funktion som tar hjälp av python filen med en api och lägger till en ny produkt med värden av variablerna. I db.js lades även bäst före datum och likande in i produkternas information. 

Designen på kassasidan har neonfärger för att ge ett rätt rent utseende. Strukturen på designen är något som definitivt hade kunnit gå bättre för oss, detta är mest för att vi planerade strukturen rätt dåligt. Om vi hade planerat exakt vad vi ville göra med strukturen eller hade använt bootstrap från början så hade antagligen det gått bättre. 

### Vad vi kunde gjort bättre

Som sagt så kunde planeringen på designen ha varit bättre men våran planering rent generellt kunde faktiskt ha varit bättre. 
Det var många gånger man inte riktigt visste vad man skulle göra på grund av den lilla planering vi hade gjort och våran "to do list" var inte så bra för att se vad man skulle göra. Fördelningen av arbetet kunde också har varit bättre då det var många gånger man höll på med något och blev klar och inte hade något man kunde göra efter. Detta kan dock gå in i samma punkt, att vi skulle planera bättre, man skulle säkert till och med kunnat planera uppdelningen vilket vi gjorde i början men inte tillräckligt mycket för att veta vad man skulle göra hela tiden.

###### Avslutningsivs

Rent generellt kunde detta projekt ha gått bättre men det gick ändå rätt bra och vi slutade med en funktionell sida som gör dess syfte och vad vi ville att den skulle göra.

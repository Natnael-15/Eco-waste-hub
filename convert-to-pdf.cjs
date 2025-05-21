const htmlPdf = require('html-pdf-node');
const fs = require('fs');

const options = {
    format: 'A4',
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
};

// Convert eco-guide
const ecoGuideHtml = fs.readFileSync('./public/assets/eco-guide.html', 'utf8');
htmlPdf.generatePdf({ content: ecoGuideHtml }, options)
    .then(pdfBuffer => {
        fs.writeFileSync('./public/assets/eco-guide.pdf', pdfBuffer);
        console.log('Eco Guide PDF created successfully!');
    })
    .catch(error => console.error('Error creating Eco Guide PDF:', error));

// Convert food waste tips
const foodWasteTipsHtml = fs.readFileSync('./public/assets/food-waste-tips.html', 'utf8');
htmlPdf.generatePdf({ content: foodWasteTipsHtml }, options)
    .then(pdfBuffer => {
        fs.writeFileSync('./public/assets/food-waste-tips.pdf', pdfBuffer);
        console.log('Food Waste Tips PDF created successfully!');
    })
    .catch(error => console.error('Error creating Food Waste Tips PDF:', error)); 
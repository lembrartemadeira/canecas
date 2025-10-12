window.onload = function () {

    // ====== CARGAR IMAGEN Y APLICAR A .strip ======
    const imageInput = document.querySelector("#inputArchivo"); // Input para cargar imagen
    imageInput.addEventListener("change", function () {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const uploadedImage = reader.result; // Imagen convertida a base64
            const strips = document.querySelectorAll('.strip');

            // Cambia el fondo de todas las tiras (.strip)
            strips.forEach(strip => {
                strip.style.backgroundImage = `url('${uploadedImage}')`;
            });
        });

        // Lee el archivo como base64
        reader.readAsDataURL(this.files[0]);
    });

    // ====== DESCARGAR IMAGEN DEL CILINDRO ======
    document.querySelector("#botonDescargar").addEventListener("click", function () {
        // Captura el contenedor del cilindro
        html2canvas(document.querySelector("#image-container")).then(canvas => {
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.download = "cilindro.png";
            link.href = canvas.toDataURL("image/png").replace("image/PNG", "image/octet-stream");
            link.click();
        });
    });

};
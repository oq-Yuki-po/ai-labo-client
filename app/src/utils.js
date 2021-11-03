export const adjustImage = (image_height, image_width, canvas_height, canvas_width) => {

    // 画像の比率
    const image_ratio = image_height / image_width;
    // canvasの比率
    const canvas_ratio = canvas_height / canvas_width;

    // 圧縮後のサイズ
    let compressed_height
    let compressed_width
    let compressed_ration

    if (image_ratio <= canvas_ratio) {
        compressed_width = canvas_width;
        compressed_ration = canvas_width / image_width;
        compressed_height = compressed_ration * image_height;
    }
    else {
        compressed_height = canvas_height;
        compressed_ration = canvas_height / image_height;
        compressed_width = compressed_ration * image_width;
    }

    compressed_height = parseInt(compressed_height)
    compressed_width = parseInt(compressed_width)
    return { 'height': compressed_height, 'width': compressed_width };
};

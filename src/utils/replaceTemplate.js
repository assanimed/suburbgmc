const replaceTemplate = (template, data) => {
    return template
      .replace("{slag}", `"${data?.slag.replaceAll(`"`, ``)}"`)
      .replace("{title}", `"${data?.title.replaceAll(`"`, `""`)}"`)
      .replace("{description}", `"${data?.description.replaceAll(`"`, `""`)}"`)
      .replace("{price1}", data?.Prices[0]?.replace(',', '.') ?? "")
      .replace("{price2}", data?.Prices[1]?.replace(',', '.') ?? "")
      .replace("{brand}", `"${data?.brand}"`)
      .replace("{category}", `"${data?.category}"`)
      .replace("{GTIN}", data?.GTINs[0])
      .replace("{image}", data?.photo);
  };


  export default replaceTemplate;
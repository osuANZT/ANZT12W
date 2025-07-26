const textarea = document.getElementById("textarea")
const teams = []
function submit() {
    const textareaValue = textarea.value
    const textareaValueSplit = textareaValue.split("\n")
    for (let i = 0; i < textareaValueSplit.length; i++) {
        const textareaValueSplitIndividual = textareaValueSplit[i].split("\t")
        const teamData = {
            teamName: textareaValueSplitIndividual[0],
            seed: Number(textareaValueSplitIndividual[1]),
            nm1Rank: Number(textareaValueSplitIndividual[2]),
            nm2Rank: Number(textareaValueSplitIndividual[3]),
            nm3Rank: Number(textareaValueSplitIndividual[4]),
            nm4Rank: Number(textareaValueSplitIndividual[5]),
            nm1Score: Number(textareaValueSplitIndividual[6]),
            nm2Score: Number(textareaValueSplitIndividual[7]),
            nm3Score: Number(textareaValueSplitIndividual[8]),
            nm4Score: Number(textareaValueSplitIndividual[9]),
            nmTotalRank: Number(textareaValueSplitIndividual[10]),
            hd1Rank: Number(textareaValueSplitIndividual[11]),
            hd2Rank: Number(textareaValueSplitIndividual[12]),
            hd3Rank: Number(textareaValueSplitIndividual[13]),
            hd1Score: Number(textareaValueSplitIndividual[14]),
            hd2Score: Number(textareaValueSplitIndividual[15]),
            hd3Score: Number(textareaValueSplitIndividual[16]),
            hdTotalRank: Number(textareaValueSplitIndividual[17]),
            hr1Rank: Number(textareaValueSplitIndividual[18]),
            hr2Rank: Number(textareaValueSplitIndividual[19]),
            hr3Rank: Number(textareaValueSplitIndividual[20]),
            hr1Score: Number(textareaValueSplitIndividual[21]),
            hr2Score: Number(textareaValueSplitIndividual[22]),
            hr3Score: Number(textareaValueSplitIndividual[23]),
            hrTotalRank: Number(textareaValueSplitIndividual[24]),
            dt1Rank: Number(textareaValueSplitIndividual[25]),
            dt2Rank: Number(textareaValueSplitIndividual[26]),
            dt3Rank: Number(textareaValueSplitIndividual[27]),
            dt1Score: Number(textareaValueSplitIndividual[28]),
            dt2Score: Number(textareaValueSplitIndividual[29]),
            dt3Score: Number(textareaValueSplitIndividual[30]),
            dtTotalRank: Number(textareaValueSplitIndividual[31]),
            player1: textareaValueSplitIndividual[32],
            player2: textareaValueSplitIndividual[33]
        }
        teams.push(teamData)
    }

    const jsonString = JSON.stringify(teams, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "qualifier-results.json";
    link.click();
}
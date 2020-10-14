/**
 * newReport.
 *
 * @param {object} data
 */
export const newReport = (data) => ({
  problemType: data.problemType,
  explanation: data.explanation,
  screenshot: data.screenshot,
});

export default newReport;

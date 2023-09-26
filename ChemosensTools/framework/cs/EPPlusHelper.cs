using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChemosensTools.Framework
{
    public static class EPPlusHelper
    {
        public static int GetColumnByName(this ExcelWorksheet ws, string columnName)
        {
            if (ws == null) throw new ArgumentNullException(nameof(ws));
            return ws.Cells["1:1"].First(c => c.Value.ToString() == columnName).Start.Column;
        }
    }
}
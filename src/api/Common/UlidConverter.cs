using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace TicketSystem.Api.Common
{
    public class UlidConverter : ValueConverter<Ulid, string>
    {
        public UlidConverter()
            : base(
                ulid => ulid.ToString(),
                str => Ulid.Parse(str))
        {
        }
    }
}
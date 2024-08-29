namespace TicketSystem.Api.Section.Shared;

public class SectionResponse
{
    public Ulid Id { get; set; }
    public string? Name { get; set; }
    public DateTime? CreationDate { get; set; }
    
}